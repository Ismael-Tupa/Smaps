const {Router} = require('express');
const router = Router();

const {
    renderEmpleado,
    renderMarcador,
    renderReporte,
    renderZona
} = require('../controllers/menu.controller');

const { isAuthenticated } = require('../helpers/auth');

router.get('/empleado', isAuthenticated, renderEmpleado);
router.get('/marcador', isAuthenticated, renderMarcador);
router.get('/reporte', isAuthenticated, renderReporte);
router.get('/zona', isAuthenticated, renderZona);

module.exports = router;