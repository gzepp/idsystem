import UserLogIn from "./login/user_loginform";
import UserFGP1 from "./login/user_fgp1";
import UserFGP2 from "./login/user_fgp2";
import UserFGP3 from "./login/user_fgp3";

import UserHomePage from "./user/user_homepage";
import UserRecords from "./user/user_records";
import UserProfileUpdate from "./user/user_recordsProfileUpdate";
import UserAnnouncementView from "./user/user_announcementsView";
import UserAnnoList from "./user/user_announcements";

import StaffLogIn from "./login/staff_loginform";
import StaffHomepage from "./staff/staff_homepage";
import StaffRecords from "./staff/staff_records";

import RegHomepage from "./registrar/registrar_homepage";
import RegRecords from "./registrar/registrar_records";
import RegReports from "./registrar/registrar_reports";
import RegUserReg from "./registrar/registrar_userReg";

import AdminDashboard from "./admin/admin_dashboard";

import AdminUReg from "./admin/admin_user_regform";
import AdminSReg from "./admin/admin_staff_regform";

import AdminAnnouncementGeneralList from "./admin/admin_announcement_general";
import AdminAnnouncementView from "./admin/admin_announcement_view";
import AdminAnnouncementPost from "./admin/admin_announcement_post";

import AdminUserRecords from "./admin/admin_user_records";
import AdminStaffRecords from "./admin/admin_staff_records";
import AdminAttendanceRecords from "./admin/admin_attendance_records";
import AdminReports from "./admin/admin_lostReport";

import AdminArchiveStaffs from "./admin/admin_archives_staff";
import AdminArchiveUsers from "./admin/admin_archives_students";
import AdminArchiveReports from "./admin/admin_archives_report";

//test
import Tester from "./admin/tester";

import testpages from "./testpages";
import pageNotfound from "./pageNotfound";

export {
  //user
  UserLogIn,
  UserFGP1,
  UserFGP2,
  UserFGP3,
  UserHomePage,
  UserRecords,
  UserProfileUpdate,
  UserAnnoList,
  UserAnnouncementView,

  //guard
  StaffLogIn,
  StaffHomepage,
  StaffRecords,

  //registar
  RegHomepage,
  RegUserReg,
  RegRecords,
  RegReports,

  //admin
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
  AdminArchiveStaffs,
  AdminArchiveUsers,
  AdminArchiveReports,

  //tests
  Tester,
  testpages,
  pageNotfound,
};
