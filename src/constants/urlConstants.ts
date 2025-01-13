//Below are URL endpoints for API calls
export const endPoints = {
  getJoinDetails: "get_join_details",
  getUserMeetingStatus: "get_user_meeting",
  markAttendance: "post_meeting_attendees",
  getUser: "get_user",
  addUser: "add_user",
  updateMeetingRegistration: "update_meeting_registration",
  faceLogin: "auth_login",
  updateUser: "update_user",
  getUserMemebersList: "get_user_member_list",
  getUsers: "get_users",
  updateUserMember: "manage_user_member",
  meetingAttendees: "meeting/attendees",
  deleteSeekerAccount: "delete_infini_user",
  /**Admin API endpoints */
  getAdminMeetingData: "get_admin_meeting",
  getRegisteredUsersForWebinar: "users/webinar",
  createMeeting: "create_meeting",

  /**Refactored version end points */
  users: "users",
  admin: "admins",
  webinars: "webinars",
  faceLoginV1: "login",
  getUserMembers: (userId: number, page: number, size: number) =>
    `users/${userId}/members?page=${page}&size=${size}`,
};
