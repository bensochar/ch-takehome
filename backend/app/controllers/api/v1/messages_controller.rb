# app/controllers/api/v1/messages_controller.rb
module Api
  module V1
    class MessagesController < BaseController
      def index
        @messages = current_user.messages.order(created_at: :desc)
        render json: @messages
      end

      def create
        @message = current_user.messages.build(message_params)
        @message.status = 'sending'
        @message.from_number = Rails.application.config.twilio[:phone_number]

        if @message.save
          TwilioService.new.send_sms(@message)
          render json: @message, status: :created
        else
          render json: @message.errors, status: :unprocessable_entity
        end
      end

      def update_status
        @message = current_user.messages.find(params[:id])
        if @message.update(status: params[:status])
          render json: @message
        else
          render json: @message.errors, status: :unprocessable_entity
        end
      end

      private

      def message_params
        params.require(:message).permit(:content, :to_number)
      end
    end
  end
end
