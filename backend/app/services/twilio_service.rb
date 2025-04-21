class TwilioService
  def send_sms(message)
    client = Twilio::REST::Client.new

    begin
      twilio_message = client.messages.create(
        to: message.to_number,
        from: Rails.application.config.twilio[:phone_number],
        body: message.content,
        status_callback: "#{Rails.application.config.twilio[:app_url]}/api/v1/messages/status"
      )

      message.update(
        twilio_sid: twilio_message.sid,
        twilio_status: twilio_message.status,
        status: 'sent'
      )
    rescue Twilio::REST::RestError => e
      message.update(
        status: 'failed',
        twilio_status: e.message
      )
    end
  end
end
