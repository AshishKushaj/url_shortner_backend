const express= require('express')
const {
  createLink,
  redirectToRealUrl,
  listAllLinks,
  statsForOneCode,
  deleteCode,
} = require("../controller/routes_controller");

const router = express.Router()



router.get("/healthz",(req,res)=>{
	return res.status(200).json({ ok: true, uptime: format(process.uptime()) });
});

router.post("/api/links", createLink);

router.get("/api/links", listAllLinks)

router.get("/api/links/:code", statsForOneCode);

router.delete("/api/links/:code", deleteCode);

router.get("/:code", redirectToRealUrl);





function format(sec) {
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}


module.exports={router}