require 'twilio-ruby'

Twilio.configure do |config|
  config.account_sid = ENV['TWILIO_ACCOUNT_SID']
  config.auth_token = ENV['TWILIO_AUTH_TOKEN']
end

# Store Twilio configuration in Rails config
Rails.application.config.twilio = {
  account_sid: ENV['TWILIO_ACCOUNT_SID'],
  auth_token: ENV['TWILIO_AUTH_TOKEN'],
  phone_number: '+18336400619',
  app_url: ENV['APP_URL'] || 'http://localhost:3000'
}
