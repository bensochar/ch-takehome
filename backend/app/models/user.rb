class User
  include Mongoid::Document
  include Mongoid::Timestamps
  include DeviseTokenAuth::Concerns::User

  devise :database_authenticatable, :registerable

  field :email,              type: String, default: ""
  field :encrypted_password, type: String, default: ""
  field :name,              type: String

  # Add index for email uniqueness
  index({ email: 1 }, { unique: true, background: true })

  # Relations
  has_many :messages

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  validates :password, presence: true, length: { minimum: 6 }
end
