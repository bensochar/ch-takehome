# Clear existing messages
Message.delete_all

# Generate 50 test messages
50.times do
  Message.create!(
    content: Faker::Lorem.sentence(word_count: 3..10),
    to_number: Faker::PhoneNumber.cell_phone,
    from_number: Faker::PhoneNumber.cell_phone,
    session_id: SecureRandom.uuid,
    status: ['pending', 'success', 'failed'].sample,
    created_at: Faker::Time.between(from: 30.days.ago, to: Time.now)
  )
end

puts "Created #{Message.count} messages"
