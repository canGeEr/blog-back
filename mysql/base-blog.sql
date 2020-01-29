/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : blog

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2020-01-25 12:14:12
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for blog_article
-- ----------------------------
DROP TABLE IF EXISTS `blog_article`;
CREATE TABLE `blog_article` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 NOT NULL,
  `tags` varchar(255) CHARACTER SET utf8 DEFAULT '',
  `user_id` int(11) NOT NULL,
  `filename` varchar(255) CHARACTER SET utf8 NOT NULL,
  `images` varchar(255) CHARACTER SET utf8 DEFAULT '',
  `create_time` varchar(14) CHARACTER SET utf8 NOT NULL,
  `edit_time` varchar(14) CHARACTER SET utf8 NOT NULL,
  `look_times` int(11) NOT NULL DEFAULT 0,
  `hit_times` int(11) unsigned NOT NULL DEFAULT 0,
  `status` enum('0','1') CHARACTER SET utf8 NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of blog_article
-- ----------------------------

-- ----------------------------
-- Table structure for blog_user
-- ----------------------------
DROP TABLE IF EXISTS `blog_user`;
CREATE TABLE `blog_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 DEFAULT '',
  `portrait` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT 'default.jpg',
  `fans` int(11) NOT NULL DEFAULT 0,
  `login_time` varchar(13) CHARACTER SET utf8 DEFAULT '' COMMENT 'js的14位字符时间戳',
  `register_time` varchar(13) CHARACTER SET utf8 NOT NULL COMMENT 's的14位字符时间戳',
  `legal` enum('N','Y') CHARACTER SET utf8 NOT NULL DEFAULT 'N',
  `grade` enum('2','1','0') CHARACTER SET utf8 NOT NULL DEFAULT '0',
  `status` enum('0','1') CHARACTER SET utf8 NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of blog_user
-- ----------------------------
INSERT INTO `blog_user` VALUES ('1', 'admin', '123456', '2020974511@qq.com', 'default.jpg', '0', '1579925616420', '1579925616420', 'Y', '2', '1');
