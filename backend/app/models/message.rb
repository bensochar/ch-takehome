# app/models/message.rb
class Message
  include Mongoid::Document
  include Mongoid::Timestamps

  field :content, type: String
  field :to_number, type: String
  field :from_number, type: String
  field :status, type: String, default: 'sending'
  field :twilio_sid, type: String
  field :twilio_status, type: String

  # Relations
  belongs_to :user, optional: false

  validates :content, presence: true
  validates :to_number, presence: true
  validates :from_number, presence: true
  validates :user, presence: true

  def send_sms
    result = TwilioService.send_sms(to_number, from_number, content)

    if result[:success]
      update(twilio_sid: result[:sid], status: 'sent')
    else
      update(status: 'failed')
      raise "Failed to send SMS: #{result[:error]}"
    end
  end

  def update_twilio_status(status)
    update(twilio_status: status)
    case status
    when 'delivered'
      update(status: 'delivered')
    when 'failed'
      update(status: 'failed')
    end
  end
end
