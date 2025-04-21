class TwilioService
  def self.send_sms(to_number, from_number, content)
    client = Twilio::REST::Client.new

    begin
      message = client.messages.create(
        to: to_number,
        from: from_number,
        body: content,
        status_callback: "#{Rails.application.config.twilio['app_url']}/api/v1/messages/status"
      )

      { success: true, sid: message.sid }
    rescue Twilio::REST::RestError => e
      { success: false, error: e.message }
    end
  end
end
