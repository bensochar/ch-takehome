DeviseTokenAuth.setup do |config|
  config.change_headers_on_each_request = false
  config.default_confirm_success_url = 'http://localhost:4200'
  config.token_lifespan = 2.weeks
  config.max_number_of_devices = 10
  config.batch_request_buffer_throttle = 5.seconds
  config.omniauth_prefix = '/omniauth'
  config.check_current_password_before_update = false
  config.headers_names = {
    :'authorization' => 'Authorization',
    :'access-token' => 'access-token',
    :'client' => 'client',
    :'expiry' => 'expiry',
    :'uid' => 'uid',
    :'token-type' => 'token-type'
  }
end
