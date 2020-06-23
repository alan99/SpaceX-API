const Router = require('koa-router');
const Crew = require('./model');
const { auth, authz } = require('../../../middleware');

const router = new Router({
  prefix: '/crew',
});

// Get all crew
router.get('/', async (ctx) => {
  ctx.state.cache = 300;
  try {
    const result = await Crew.find({});
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Get one crew member
router.get('/:id', async (ctx) => {
  ctx.state.cache = 300;
  try {
    const result = await Crew.findById(ctx.params.id);
    if (!result) {
      ctx.throw(404);
    }
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Query crew members
router.post('/query', async (ctx) => {
  ctx.state.cache = 300;
  const { query = {}, options = {} } = ctx.request.body;
  try {
    const result = await Crew.paginate(query, options);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Create crew member
router.post('/', auth, authz, async (ctx) => {
  try {
    const crew = new Crew(ctx.request.body);
    await crew.save();
    ctx.status = 201;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Update crew member
router.patch('/:id', auth, authz, async (ctx) => {
  try {
    await Crew.findByIdAndUpdate(ctx.params.id, ctx.request.body, { runValidators: true });
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Delete crew member
router.delete('/:id', auth, authz, async (ctx) => {
  try {
    await Crew.findByIdAndDelete(ctx.params.id);
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

module.exports = router;
