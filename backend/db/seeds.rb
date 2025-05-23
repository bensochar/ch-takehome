Message.delete_all
User.delete_all

10.times do
  full_name = Faker::TvShows::Simpsons.character
  first_name = full_name.split(' ').first.downcase
  email = "#{first_name}@simpsons.com"
  password = '123456'
  user = User.new(
    name: full_name,
    email: email,
    password: password,
    password_confirmation: password,
    provider: 'email',
    uid: email,
    confirmed_at: Time.zone.now,
    tokens: {}
  )

  if user.valid?
    user.save!
    puts "User created: #{user.name}"
    puts "Login with:"
    puts "  Email: #{email}"
    puts "  Password: #{password}"
    puts "----------------------------------------"
  else
    puts "D'oh! User validation failed: #{user.errors.full_messages.join(', ')}"
  end
end

# Get all valid user IDs
valid_user_ids = User.all.pluck(:id)


50.times do
  user_id = valid_user_ids.sample
  user = User.find(user_id)
  message = Message.new(
    content: Faker::TvShows::Simpsons.quote,
    to_number: Faker::PhoneNumber.cell_phone,
    from_number: Faker::PhoneNumber.cell_phone,
    user: user,
    status: ['sending', 'sent', 'failed'].sample,
    created_at: Faker::Time.between(from: 30.days.ago, to: Time.zone.now)
  )

  if message.valid?
    message.save!
  else
    puts "Errors: #{message.errors.full_messages.join(', ')}"
  end
end

