'use strict';

const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const User                = require('./User');
const OtpToken            = require('./OtpToken');
const RefreshToken        = require('./RefreshToken');
const Company             = require('./Company');
const CompanyMember       = require('./CompanyMember');
const SubscriptionPlan    = require('./SubscriptionPlan');
const CompanySubscription = require('./CompanySubscription');
const CV                  = require('./CV');
const JobCategory         = require('./JobCategory');
const Job                 = require('./Job');
const JobApplication      = require('./JobApplication');
const TrainingSession     = require('./TrainingSession');
const CourseCategory      = require('./CourseCategory');
const Course              = require('./Course');
const CourseLesson        = require('./CourseLesson');
const UserCourse          = require('./UserCourse');
const LessonProgress      = require('./LessonProgress');
const LearningPath        = require('./LearningPath');
const CommunityPost       = require('./CommunityPost');
const PostComment         = require('./PostComment');
const PostLike            = require('./PostLike');
const PostReport          = require('./PostReport');
const ChatCategory        = require('./ChatCategory');
const ChatRoom            = require('./ChatRoom');
const ChatMessage         = require('./ChatMessage');
const ChatTimeUsage       = require('./ChatTimeUsage');
const DirectMessage       = require('./DirectMessage');
const Wallet              = require('./Wallet');
const WalletTransaction   = require('./WalletTransaction');
const Referral            = require('./Referral');
const Notification        = require('./Notification');
const AuditLog            = require('./AuditLog');
const UserConnection      = require('./UserConnection');

// ── User ─────────────────────────────────────────────────────
User.hasMany(OtpToken,        { foreignKey: 'userId', as: 'otpTokens' });
User.hasMany(RefreshToken,    { foreignKey: 'userId', as: 'refreshTokens' });
User.hasOne(Wallet,           { foreignKey: 'userId', as: 'wallet' });
User.hasMany(CV,              { foreignKey: 'userId', as: 'cvs' });
User.hasMany(JobApplication,  { foreignKey: 'userId', as: 'applications' });
User.hasMany(TrainingSession, { foreignKey: 'userId', as: 'trainingSessions' });
User.hasMany(UserCourse,      { foreignKey: 'userId', as: 'enrolledCourses' });
User.hasMany(CommunityPost,   { foreignKey: 'userId', as: 'posts' });
User.hasMany(PostComment,     { foreignKey: 'userId', as: 'comments' });
User.hasMany(PostLike,        { foreignKey: 'userId', as: 'likes' });
User.hasMany(ChatMessage,     { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(DirectMessage,   { foreignKey: 'senderId', as: 'sentDMs' });
User.hasMany(DirectMessage,   { foreignKey: 'recipientId', as: 'receivedDMs' });
User.hasMany(Notification,    { foreignKey: 'userId', as: 'notifications' });
User.hasMany(Referral,        { foreignKey: 'referrerId', as: 'referralsMade' });
User.hasOne(LearningPath,     { foreignKey: 'userId', as: 'learningPath' });
User.hasMany(UserConnection,  { foreignKey: 'followerId', as: 'following' });
User.hasMany(UserConnection,  { foreignKey: 'followingId', as: 'followers' });
User.hasMany(Company,         { foreignKey: 'ownerId', as: 'ownedCompanies' });
User.hasMany(AuditLog,        { foreignKey: 'actorId', as: 'auditLogs' });

OtpToken.belongsTo(User,      { foreignKey: 'userId', as: 'user' });
RefreshToken.belongsTo(User,  { foreignKey: 'userId', as: 'user' });
Wallet.belongsTo(User,        { foreignKey: 'userId', as: 'user' });
CV.belongsTo(User,            { foreignKey: 'userId', as: 'user' });

// ── Company ───────────────────────────────────────────────────
Company.belongsTo(User,               { foreignKey: 'ownerId', as: 'owner' });
Company.hasMany(Job,                  { foreignKey: 'companyId', as: 'jobs' });
Company.hasMany(CompanyMember,        { foreignKey: 'companyId', as: 'members' });
Company.hasMany(CompanySubscription,  { foreignKey: 'companyId', as: 'subscriptions' });
CompanyMember.belongsTo(Company,      { foreignKey: 'companyId' });
CompanyMember.belongsTo(User,         { foreignKey: 'userId', as: 'user' });
CompanySubscription.belongsTo(Company,          { foreignKey: 'companyId' });
CompanySubscription.belongsTo(SubscriptionPlan, { foreignKey: 'planId', as: 'plan' });

// ── Job ───────────────────────────────────────────────────────
Job.belongsTo(Company,      { foreignKey: 'companyId', as: 'company' });
Job.belongsTo(JobCategory,  { foreignKey: 'categoryId', as: 'category' });
Job.hasMany(JobApplication, { foreignKey: 'jobId', as: 'applications' });
JobApplication.belongsTo(Job,  { foreignKey: 'jobId', as: 'job' });
JobApplication.belongsTo(User, { foreignKey: 'userId', as: 'applicant' });
JobApplication.belongsTo(CV,   { foreignKey: 'cvId', as: 'cv' });
JobCategory.hasMany(Job,           { foreignKey: 'categoryId', as: 'jobs' });
JobCategory.belongsTo(JobCategory, { foreignKey: 'parentId', as: 'parent' });
JobCategory.hasMany(JobCategory,   { foreignKey: 'parentId', as: 'children' });

// ── Course ────────────────────────────────────────────────────
Course.belongsTo(CourseCategory,     { foreignKey: 'categoryId', as: 'category' });
Course.hasMany(CourseLesson,         { foreignKey: 'courseId', as: 'lessons' });
Course.hasMany(UserCourse,           { foreignKey: 'courseId', as: 'enrolments' });
CourseLesson.belongsTo(Course,       { foreignKey: 'courseId', as: 'course' });
CourseLesson.hasMany(LessonProgress, { foreignKey: 'lessonId', as: 'progress' });
UserCourse.belongsTo(User,           { foreignKey: 'userId', as: 'user' });
UserCourse.belongsTo(Course,         { foreignKey: 'courseId', as: 'course' });
LessonProgress.belongsTo(User,       { foreignKey: 'userId', as: 'user' });
LessonProgress.belongsTo(CourseLesson, { foreignKey: 'lessonId', as: 'lesson' });
CourseCategory.belongsTo(CourseCategory, { foreignKey: 'parentId', as: 'parent' });
CourseCategory.hasMany(CourseCategory,   { foreignKey: 'parentId', as: 'children' });

// ── Community ─────────────────────────────────────────────────
CommunityPost.belongsTo(User,       { foreignKey: 'userId', as: 'author' });
CommunityPost.hasMany(PostComment,  { foreignKey: 'postId', as: 'comments' });
CommunityPost.hasMany(PostLike,     { foreignKey: 'postId', as: 'likes' });
PostComment.belongsTo(CommunityPost, { foreignKey: 'postId', as: 'post' });
PostComment.belongsTo(User,          { foreignKey: 'userId', as: 'author' });
PostComment.belongsTo(PostComment,   { foreignKey: 'parentId', as: 'parent' });
PostComment.hasMany(PostComment,     { foreignKey: 'parentId', as: 'replies' });
PostLike.belongsTo(User,             { foreignKey: 'userId', as: 'user' });

// ── Chat ──────────────────────────────────────────────────────
ChatRoom.belongsTo(ChatCategory, { foreignKey: 'categoryId', as: 'category' });
ChatRoom.hasMany(ChatMessage,    { foreignKey: 'roomId', as: 'messages' });
ChatCategory.hasMany(ChatRoom,   { foreignKey: 'categoryId', as: 'rooms' });
ChatMessage.belongsTo(ChatRoom,  { foreignKey: 'roomId', as: 'room' });
ChatMessage.belongsTo(User,      { foreignKey: 'senderId', as: 'sender' });
DirectMessage.belongsTo(User,    { foreignKey: 'senderId', as: 'sender' });
DirectMessage.belongsTo(User,    { foreignKey: 'recipientId', as: 'recipient' });

// ── Wallet ────────────────────────────────────────────────────
Wallet.hasMany(WalletTransaction,   { foreignKey: 'walletId', as: 'transactions' });
WalletTransaction.belongsTo(Wallet, { foreignKey: 'walletId', as: 'wallet' });

// ── Misc ──────────────────────────────────────────────────────
Referral.belongsTo(User, { foreignKey: 'referrerId', as: 'referrer' });
Referral.belongsTo(User, { foreignKey: 'refereeId',  as: 'referee' });
TrainingSession.belongsTo(User, { foreignKey: 'userId', as: 'user' });
TrainingSession.belongsTo(Job,  { foreignKey: 'jobId',  as: 'job' });

module.exports = {
  sequelize,
  Sequelize,
  User, OtpToken, RefreshToken,
  Company, CompanyMember, SubscriptionPlan, CompanySubscription,
  JobCategory, Job, JobApplication,
  CV,
  TrainingSession,
  CourseCategory, Course, CourseLesson, UserCourse, LessonProgress, LearningPath,
  CommunityPost, PostComment, PostLike, PostReport,
  ChatCategory, ChatRoom, ChatMessage, ChatTimeUsage, DirectMessage,
  Wallet, WalletTransaction, Referral,
  Notification, AuditLog, UserConnection,
};
