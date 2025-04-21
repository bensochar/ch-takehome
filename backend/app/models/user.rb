class User
  include Mongoid::Document
  include Mongoid::Timestamps
  include DeviseTokenAuth::Concerns::User

  # Include default devise modules.
  devise :database_authenticatable, :registerable


  field :email,              type: String, default: ""
  field :encrypted_password, type: String, default: ""

  ## Required for Devise
  field :provider,          type: String, default: 'email'
  field :uid,               type: String, default: ''
  field :tokens,            type: Hash, default: {}
  field :confirmed_at,      type: Time


  field :name,              type: String


  index({ email: 1 }, { unique: true, background: true })

  has_many :messages

  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :name, presence: true
  validates :password, presence: true, length: { minimum: 6 }, if: :password_required?

  # Callbacks
  before_validation :set_uid
  before_validation :normalize_email

  private

  def set_uid
    self.uid = email if uid.blank? && email.present?
  end

  def password_required?
    new_record? || !password.nil?
  end

  def normalize_email
    self.email = email.downcase.strip if email.present?
  end
end
