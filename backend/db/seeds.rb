Message.delete_all
User.delete_all

10.times do
  email = Faker::Internet.email
	password = '123456'
  user = User.new(
    name: Faker::TvShows::Simpsons.character,
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
  else
    puts "User validation failed: #{user.errors.full_messages.join(', ')}"
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
    puts "Message created successfully"
  else
    puts "Errors: #{message.errors.full_messages.join(', ')}"
  end
end

