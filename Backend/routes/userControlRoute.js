import express from "express";
import authenticateToken from "../middleware/authenticateToken.js"

import{ getPatagonData} from "../controllers/interactionControllers.js"
import { newUserCreation , AllUsers} from "../controllers/newUserController.js";


const router = express.Router();

//rutas protegidas
router.get("/",authenticateToken, getPatagonData);

router.post("/new-user-creation", newUserCreation);
router.get("/users", authenticateToken ,AllUsers);


export {router as UserControlRouter}