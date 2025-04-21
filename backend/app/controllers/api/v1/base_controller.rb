module Api
  module V1
    class BaseController < ApplicationController
      include DeviseTokenAuth::Concerns::SetUserByToken
      before_action :authenticate_user!

      def current_user
        @current_user ||= begin
          # Log request details
          Rails.logger.debug "Request ID: #{request.request_id}"
          Rails.logger.debug "Request Method: #{request.method}"
          Rails.logger.debug "Request Path: #{request.path}"

          # Log all relevant headers
          Rails.logger.debug "All Headers: #{request.headers.to_h.select { |k,v| k.downcase.include?('uid') || k.downcase.include?('access-token') || k.downcase.include?('client') }}"

          # Try different header formats
          uid = request.headers['uid'] || request.headers['Uid'] || request.headers['UID']
          access_token = request.headers['access-token'] || request.headers['Access-Token'] || request.headers['ACCESS-TOKEN']
          client = request.headers['client'] || request.headers['Client'] || request.headers['CLIENT']

          Rails.logger.debug "Auth Headers - UID: #{uid}, Access-Token: #{access_token}, Client: #{client}"

          if uid.present? && access_token.present? && client.present?
            user = User.find_by(uid: uid)
            if user
              Rails.logger.debug "Found user: #{user.email}"
              user
            else
              Rails.logger.debug "No user found with uid: #{uid}"
              nil
            end
          else
            Rails.logger.debug "Missing required headers"
            nil
          end
        end
      end

      private

      def authenticate_user!
        Rails.logger.debug "Authentication check for request: #{request.request_id}"
        unless current_user
          Rails.logger.debug "Authentication failed - Headers: #{request.headers.to_h.select { |k,v| k.downcase.include?('uid') || k.downcase.include?('access-token') || k.downcase.include?('client') }}"
          render json: { error: 'Unauthorized - Missing or invalid authentication headers' }, status: :unauthorized
        end
      end
    end
  end
end
