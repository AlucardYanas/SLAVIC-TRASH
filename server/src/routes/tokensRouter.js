const cookiesConfig = require('../../config/cookiesConfig');
const generateTokens = require('../utils/generateTokens');
const express = require('express');
const verifyRefreshToken = require('../middlewares/verifyRefreshToken');

const tokensRouter = express.Router();

tokensRouter.get('/refresh', verifyRefreshToken, async (req, res) => {
  const { accessToken, refreshToken } = generateTokens({
    user: res.locals.user,
  });
  res
    .cookie('refreshToken', refreshToken, cookiesConfig)
    .json({ accessToken, user: res.locals.user });
});

module.exports = tokensRouter;
