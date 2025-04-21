class TwilioService
  def send_sms(message)
    # Initialize Twilio client with credentials from config
    client = Twilio::REST::Client.new(
      Rails.application.config.twilio[:account_sid],
      Rails.application.config.twilio[:auth_token]
    )

    begin
      Rails.logger.info "Sending SMS to: #{message.to_number} from: #{Rails.application.config.twilio[:phone_number]}"

      # Create the message using the documented method
      twilio_message = client.messages.create(
        from: Rails.application.config.twilio[:phone_number],
        to: message.to_number,
        body: message.content
      )

      message.update(
        twilio_sid: twilio_message.sid,
        twilio_status: twilio_message.status,
        status: 'sent'
      )
    rescue Twilio::REST::RestError => e
      Rails.logger.error "Twilio error: #{e.message}"
      message.update(
        status: 'failed',
        twilio_status: e.message
      )
    rescue StandardError => e
      Rails.logger.error "Error sending SMS: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      message.update(
        status: 'failed',
        twilio_status: "Internal error: #{e.message}"
      )
    end
  end
end
