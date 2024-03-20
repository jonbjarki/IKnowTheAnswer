import { Router } from "express";
import { getMatches, getMatchById, createMatch } from "../services/matchService.js";
import ensureLogin from "./helpers/ensureLogin.js";
import validateErrors from './helpers/validateErrors.js';
import { body } from "express-validator";
const router = Router();

router.get('/matches', ensureLogin, async (req, res) => res.json(await getMatches()));

router.get('/matches/:matchId', ensureLogin, async (req, res) => res.json(await getMatchById(req.params.matchId)));

router.post(
  '/matches',
  body('title').isLength({ min: 3 }),
  body('titleImage').isLength({ min: 1 }),
  body('questions').isArray({ min: 1 }),
  body('owner').isObject(),
  validateErrors,
  ensureLogin,
  async (req, res) => {
    const success = await createMatch(req.body);
    return success ? res.sendStatus(201) : res.sendStatus(500);
});

export default router;