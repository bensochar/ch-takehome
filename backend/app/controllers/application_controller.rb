class ApplicationController < ActionController::Base
  include DeviseTokenAuth::Concerns::SetUserByToken
  protect_from_forgery with: :null_session
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:account_update, keys: [:email, :password, :password_confirmation])
  end

  def update_auth_header
    return if @resource.nil?

    # Generate new client_id and token
    @client_id = SecureRandom.urlsafe_base64(nil, false)
    @token     = SecureRandom.urlsafe_base64(nil, false)

    @resource.tokens[@client_id] = {
      token: BCrypt::Password.create(@token),
      expiry: (Time.now + DeviseTokenAuth.token_lifespan).to_i
    }

    @resource.save!

    response.headers['access-token'] = @token
    response.headers['client'] = @client_id
    response.headers['expiry'] = @resource.tokens[@client_id]['expiry']
    response.headers['uid'] = @resource.uid
    response.headers['token-type'] = 'Bearer'
  end
end
