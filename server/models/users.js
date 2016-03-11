'use strict';
const Promise = require('bluebird');
let mongoose = require('mongoose');
let _ = require('lodash');

let userSchema = mongoose.Schema({
  login: { type: String, required: true },
  id: { type: Number, required: true },
  avatar_url: { type: String },
  gravatar_id: { type: String },
  url: { type: String },
  html_url: { type: String },
  followers_url: { type: Number },
  following_url: { type: Number },
  gists_url: { type: String },
  starred_url: { type: String },
  subscriptions_url: { type: String },
  organizations_url: { type: String },
  repos_url: { type: String },
  events_url: { type: String },
  received_events_url: { type: String },
  type: { type: String },
  site_admin: { type: Boolean },
  name: { type: String },
  company: { type: String },
  blog: { type: String },
  location: { type: String },
  email: { type: String, required: true },
  hireable: { type: Boolean },
  bio: { type: String },
  public_repos: { type: Number },
  public_gists: { type: Number },
  followers: { type: String },
  following: { type: String },
  created_at: { type: String },
  updated_at: { type: String },
  total_private_repos: { type: Number },
  owned_private_repos: { type: Number },
  private_gists: { type: Number },
  disk_usage: { type: Number },
  collaborators: { type: String },
  plan:{
    name: { type: String },
    space: { type: String },
    private_repos: { type: Number },
    collaborators: { type: Number },
  },
  directories: { type: Schema.Types.Mixed, default: {'myFiles': 'root'}},
  files: { type: Schema.Types.Mixed },
});

let User = mongoose.model('User',userSchema);



module.exports = User;
