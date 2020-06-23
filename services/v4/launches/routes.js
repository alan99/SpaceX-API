const Router = require('koa-router');
const Launch = require('./model');
const { auth, authz } = require('../../../middleware');

const router = new Router({
  prefix: '/launches',
});

//
// Convenience Endpoints
//

// Get past launches
router.get('/past', async (ctx) => {
  ctx.state.cache = 20;
  try {
    const result = await Launch.find({
      upcoming: false,
    }, null, {
      sort: {
        flight_number: 'asc',
      },
    });
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Get upcoming launches
router.get('/upcoming', async (ctx) => {
  ctx.state.cache = 20;
  try {
    const result = await Launch.find({
      upcoming: true,
    }, null, {
      sort: {
        flight_number: 'asc',
      },
    });
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Get latest launch
router.get('/latest', async (ctx) => {
  ctx.state.cache = 20;
  try {
    const result = await Launch.findOne({
      upcoming: false,
    }, null, {
      sort: {
        flight_number: 'desc',
      },
    });
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Get next launch
router.get('/next', async (ctx) => {
  ctx.state.cache = 20;
  try {
    const result = await Launch.findOne({
      upcoming: true,
    }, null, {
      sort: {
        flight_number: 'asc',
      },
    });
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

//
// Standard Endpoints
//

// Get all launches
router.get('/', async (ctx) => {
  ctx.state.cache = 20;
  try {
    const result = await Launch.find({});
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Get one launch
router.get('/:id', async (ctx) => {
  ctx.state.cache = 20;
  try {
    const result = await Launch.findById(ctx.params.id);
    if (!result) {
      ctx.throw(404);
    }
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Query launches
router.post('/query', async (ctx) => {
  ctx.state.cache = 20;
  const { query = {}, options = {} } = ctx.request.body;
  try {
    const result = await Launch.paginate(query, options);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Create a launch
router.post('/', auth, authz, async (ctx) => {
  try {
    const launch = new Launch(ctx.request.body);
    await launch.save();
    ctx.status = 201;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Update a launch
router.patch('/:id', auth, authz, async (ctx) => {
  try {
    await Launch.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
      runValidators: true,
    });
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Delete a launch
router.delete('/:id', auth, authz, async (ctx) => {
  try {
    await Launch.findByIdAndDelete(ctx.params.id);
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

module.exports = router;
