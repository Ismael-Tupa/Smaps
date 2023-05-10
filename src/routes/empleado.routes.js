const {Router} = require('express');
const router = Router();

const { 
    empleados,
    renderFromCreate,
    createEmpleado,
    renderFromUpdate,
    updateEmpleados,
    bajaEmpleado
    } = require('../controllers/empleado.controller');

router.get('/empleados', empleados);
router.get('/empleado/new', renderFromCreate);
router.post('/empleado/new', createEmpleado);
router.get('/empleado/update', renderFromUpdate);
router.put('/empleado/update', updateEmpleados);
router.put('/empleado/baja', bajaEmpleado);

module.exports = router;