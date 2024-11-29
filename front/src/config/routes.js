import {
  UserLogIn,
  UserFGP1,
  UserFGP2,
  UserFGP3,
  UserHomePage,
  UserRecords,
  UserProfileUpdate,
  UserAnnoList,
  UserAnnouncementView,

  StaffLogIn,
  StaffHomepage,
  StaffRecords,

  RegHomepage,
  RegRecords,
  RegReports,
  RegUserReg,

  AdminDashboard,
  AdminUReg,
  AdminSReg,
  AdminAnnouncementGeneralList,
  AdminAnnouncementView,
  AdminAnnouncementPost,
  AdminUserRecords,
  AdminStaffRecords,
  AdminAttendanceRecords,
  AdminReports,
  AdminArchiveUsers,
  AdminArchiveStaffs,
  AdminArchiveReports,


  //tests
  Tester,
  pageNotfound,
} from "../pages";

const routes = [
  {
    path: "/",
    component: UserLogIn,
  },

  {
    path: "/user_forgotpassword",
    component: UserFGP1,
  },

  {
    path: "/user_checkemail",
    component: UserFGP2,
  },

  {
    path: "/user_resetpassword",
    component: UserFGP3,
  },

  {
    path: "/user_resetpassword",
    component: UserFGP3,
  },

  {
    path: "/user_homepage",
    component: UserHomePage,
  },
  {
    path: "/user_records",
    component: UserRecords,
  },
  {
    path: "/user_profileupdate",
    component: UserProfileUpdate,
  },
  {
    path: "/user_annolist",
    component: UserAnnoList,
  },

  {
    path: "/user_annoview/:annoItem",
    component: UserAnnouncementView,
  },
  {
    path: "/staff",
    component: StaffLogIn,
  },
  {
    path: "/staff_homepage",
    component: StaffHomepage,
  },
  {
    path: "/staff_records",
    component: StaffRecords,
  },
  {
    path: "/reg_homepage",
    component: RegHomepage,
  },
  {
    path: "/reg_records",
    component: RegRecords,
  },
  {
    path: "/reg_reports",
    component: RegReports,
  },
  {
    path: "/reg_userreg",
    component: RegUserReg,
  },
  {
    path: "/admin_dashboard",
    component: AdminDashboard,
  },
  {
    path: "/admin_user_registration",
    component: AdminUReg,
  },
  {
    path: "/admin_staff_registration",
    component: AdminSReg,
  },
  {
    path: "/admin_user_records",
    component: AdminUserRecords,
  },
  {
    path: "/admin_staff_records",
    component: AdminStaffRecords,
  },
  {
    path: "/admin_attendance_records",
    component: AdminAttendanceRecords,
  },
  {
    path: "/admin_id_reports",
    component: AdminReports,
  },
  {
    path: "/admin_anno_list",
    component: AdminAnnouncementGeneralList,
  },
  {
    path: "/admin_anno_view/:annoData",
    component: AdminAnnouncementView,
  },
  {
    path: "/admin_anno_post",
    component: AdminAnnouncementPost,
  },
  {
    path: "/admin_archive_student",
    component: AdminArchiveUsers,
  },
  {
    path: "/admin_archive_staff",
    component: AdminArchiveStaffs,
  },
  {
    path: "/admin_archive_id",
    component: AdminArchiveReports,
  },

  {
    path: "/test",
    component: Tester,
  },

  {
    path: "/*",
    component: pageNotfound,
  },
];

export default routes;
