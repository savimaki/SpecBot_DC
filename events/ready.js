module.exports = client => {
  const SQLite = require(`better-sqlite3`)
  const log = require(`node-file-logger`)
  const { options } = require(`../configs/options`)
  const { setActivity } = require(`../libs/eventLibs`)
  log.SetUserOptions(options)

  function createTable (table, tablename, args) {
    table.prepare(`CREATE TABLE IF NOT EXISTS ${tablename}(${args});`).run()
  }

  let sql = new SQLite(`./DBs/scores.sqlite3`)
  let table = sql.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';`).get()
  if (!table[`count(*)`]) {
    createTable(table, `scores`, `id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER`)
    sql.prepare(`CREATE UNIQUE INDEX idx_scores_id ON scores (id);`).run()
    sql.pragma(`synchronous = 1`)
    sql.pragma(`journal_mode = wal`)
  }
  client.getScore = sql.prepare(`SELECT * FROM scores WHERE user = ? AND guild = ?`)
  client.setScore = sql.prepare(`INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);`)

  const confArgs = 'id INTEGER PRIMARY KEY, conf TEXT NOT NULL'
  sql = new SQLite(`./DBs/configurations.sqlite3`)
  table = sql.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'conf1';`)
  if (!table[`count(*)`]) {
    createTable(table, `conf1`, confArgs)
  }
  table = sql.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'conf2';`)
  if (!table[`count(*)`]) {
    createTable(table, `conf2`, confArgs)
  }
  table = sql.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'server';`)
  if (!table[`count(*)`]) {
    createTable(table, `server`, confArgs)
  }
  setActivity(client)

  log.Info(`Ready!`)
}
