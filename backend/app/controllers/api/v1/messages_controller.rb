# app/controllers/api/v1/messages_controller.rb
module Api
  module V1
    class MessagesController < ApplicationController
      before_action :authenticate_user!
      skip_before_action :verify_authenticity_token, only: [:status]

      def index
        @messages = current_user.messages.order(created_at: :desc)
        render json: @messages
      end

      def create
        @message = current_user.messages.build(message_params)

        if @message.save
          @message.send_sms
          render json: @message, status: :created
        else
          render json: @message.errors, status: :unprocessable_entity
        end
      end

      def status
        message = Message.find_by(twilio_sid: params[:MessageSid])
        if message
          message.update_twilio_status(params[:MessageStatus])
          head :ok
        else
          head :not_found
        end
      end

      private

      def message_params
        params.require(:message).permit(:content, :to_number, :from_number)
      end
    end
  end
end
