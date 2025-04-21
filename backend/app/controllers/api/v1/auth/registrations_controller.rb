module Api
  module V1
    module Auth
      class RegistrationsController < DeviseTokenAuth::RegistrationsController
        def create
          super do |user|
            if user.errors.any?
              render json: {
                status: 'error',
                errors: user.errors.full_messages
              }, status: :unprocessable_entity and return
            end
          end
        end

        protected

        def build_resource
          @resource = resource_class.new(sign_up_params.except(:confirm_success_url))
          @resource.provider = provider
          @resource.confirmed_at = Time.zone.now # Auto-confirm the user
          @resource.uid = sign_up_params[:email] if @resource.uid.blank?

          @resource
        end

        # Skip confirmation requirement
        def require_confirmation?
          false
        end

        def validate_post_data(which, resource_params)
          true
        end

        private

        def sign_up_params
          params.permit(:email, :password, :password_confirmation, :name, :confirm_success_url)
        end

        def account_update_params
          params.permit(:email, :password, :password_confirmation, :name)
        end

        def render_create_success
          render json: {
            status: 'success',
            data: resource_data
          }
        end
      end
    end
  end
end
