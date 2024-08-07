const { Router } = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../../db/models');
const generateTokens = require('../utils/generateTokens');
const cookiesConfig = require('../../config/cookiesConfig');
const router = Router();

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (username && email && password) {
    try {
      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: { username, password: await bcrypt.hash(password, 10) },
      });

      if (!created) {
        return res.status(403).json({ message: 'User already exists' });
      }

      const plainUser = user.get();
      delete plainUser.password;

      const { accessToken, refreshToken } = generateTokens({ user: plainUser });

      return res
        .cookie('refreshToken', refreshToken, cookiesConfig.refresh)
        .status(200)
        .json({ accessToken, user: plainUser });
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
  }
  return res.sendStatus(500);
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    try {
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Incorrect password' });
      }

      const plainUser = user.get();
      delete plainUser.password;

      const { accessToken, refreshToken } = generateTokens({ user: plainUser });

      return res
        .cookie('refreshToken', refreshToken, cookiesConfig.refresh)
        .status(200)
        .json({ accessToken, user: plainUser });
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
  }
  return res.sendStatus(500);
});

router.get('/logout', (req, res) => {
  res.clearCookie('refreshToken').sendStatus(200);
});

module.exports = router;
