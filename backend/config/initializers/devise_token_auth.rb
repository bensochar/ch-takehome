DeviseTokenAuth.setup do |config|
  config.change_headers_on_each_request = false
  config.token_cost = Rails.env.test? ? 4 : 10
  config.batch_request_buffer_throttle = 5.seconds
  config.redirect_whitelist = ['http://localhost:4200']
  config.check_current_password_before_update = :password
  config.enable_standard_devise_support = true
  config.headers_names = {:'access-token' => 'access-token',
                         :'client' => 'client',
                         :'expiry' => 'expiry',
                         :'uid' => 'uid',
                         :'token-type' => 'token-type' }
end
