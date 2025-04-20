# app/models/message.rb
class Message
  include Mongoid::Document
  include Mongoid::Timestamps

  field :content, type: String
  field :to_number, type: String
  field :from_number, type: String
  field :status, type: String, default: 'pending'

  belongs_to :user

  validates :content, presence: true
  validates :to_number, presence: true
  validates :from_number, presence: true
  validates :user_id, presence: true
end
