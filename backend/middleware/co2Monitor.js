const { co2: CO2 } = require('@tgwf/co2');

const co2Emit = new CO2({ model: 'swd' });

const metrics = {
  totalRequests: 0,
  totalBytes: 0,
  totalCO2: 0,
  requestsByEndpoint: {},
  startTime: Date.now()
};

function bytesToCO2(bytes) {
  return co2Emit.perByte(bytes);
}

const co2Monitor = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationNs = Number(end - start);

    const contentLength = parseInt(res.get('Content-Length') || '0', 10);
    const bytes = contentLength || JSON.stringify(req.body || '').length;

    const estimatedCO2 = bytesToCO2(bytes);
    const endpoint = `${req.method} ${req.route?.path || req.originalUrl}`;

    metrics.totalRequests++;
    metrics.totalBytes += bytes;
    metrics.totalCO2 += estimatedCO2;
    metrics.requestsByEndpoint[endpoint] = (metrics.requestsByEndpoint[endpoint] || 0) + 1;

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[CO2] ${req.method} ${req.originalUrl} | ` +
        `${(durationNs / 1e6).toFixed(2)}ms | ` +
        `${bytes} bytes | ` +
        `${(estimatedCO2 * 1e6).toFixed(4)} µg CO₂`
      );
    }
  });

  next();
};

const getMetrics = (req, res) => {
  const uptime = Math.floor((Date.now() - metrics.startTime) / 1000);
  res.json({
    uptime,
    totalRequests: metrics.totalRequests,
    totalBytes: metrics.totalBytes,
    totalCO2g: parseFloat((metrics.totalCO2 * 1000).toFixed(6)),
    averageCO2PerRequest: metrics.totalRequests > 0
      ? parseFloat((metrics.totalCO2 / metrics.totalRequests * 1e6).toFixed(4))
      : 0,
      requestsByEndpoint: metrics.requestsByEndpoint,
      model: 'swd',
    timestamp: new Date().toISOString()
  });
};

module.exports = { co2Monitor, getMetrics };