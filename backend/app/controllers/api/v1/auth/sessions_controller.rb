module Api
  module V1
    module Auth
      class SessionsController < DeviseTokenAuth::SessionsController
        def create
          # Check if email is present
          if params[:email].blank?
            render json: { error: 'Email is required' }, status: :unprocessable_entity
            return
          end

          # Check if password is present
          if params[:password].blank?
            render json: { error: 'Password is required' }, status: :unprocessable_entity
            return
          end

          # Find user by email
          @resource = User.find_by(email: params[:email].downcase)

          if @resource && @resource.valid_password?(params[:password])
            # Create token info
            @client_id = SecureRandom.urlsafe_base64(nil, false)
            @token     = SecureRandom.urlsafe_base64(nil, false)

            @resource.tokens[@client_id] = {
              token: BCrypt::Password.create(@token),
              expiry: (Time.now + DeviseTokenAuth.token_lifespan).to_i
            }

            @resource.save!

            sign_in(:user, @resource, store: false, bypass: false)
            yield @resource if block_given?

            # Set response headers
            response.headers['access-token'] = @token
            response.headers['client'] = @client_id
            response.headers['expiry'] = @resource.tokens[@client_id]['expiry']
            response.headers['uid'] = @resource.uid
            response.headers['token-type'] = 'Bearer'

            # Log headers being set
            Rails.logger.debug "Setting auth headers:"
            Rails.logger.debug "access-token: #{@token}"
            Rails.logger.debug "client: #{@client_id}"
            Rails.logger.debug "uid: #{@resource.uid}"

            render json: {
              data: @resource.as_json(except: [:tokens, :created_at, :updated_at]),
              success: true
            }, status: :ok
          else
            render json: { error: 'Invalid email or password' }, status: :unauthorized
          end
        end
      end
    end
  end
end
