DeviseTokenAuth.setup do |config|
  # By default the authorization headers will change after each request. The
  # client is responsible for keeping track of the changing tokens. Change
  # this to false to prevent the Authorization header from changing after
  # each request.
  config.change_headers_on_each_request = false
  config.token_lifespan = 2.weeks
  config.max_number_of_devices = 10
  config.batch_request_buffer_throttle = 5.seconds
  config.omniauth_prefix = "/omniauth"
  config.headers_names = {
    :'authorization' => 'Authorization',
    :'access-token' => 'access-token',
    :'client' => 'client',
    :'expiry' => 'expiry',
    :'uid' => 'uid',
    :'token-type' => 'token-type'
  }
end
