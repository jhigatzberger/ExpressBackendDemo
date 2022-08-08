import { ConnectionConfig, Connection as TediousConnection, Request as TediousRequest, ColumnValue } from 'tedious'

const config: ConnectionConfig = {
  server: process.env.SQL_SERVER,
  authentication: {
    type: 'default',
    options: {
      userName: process.env.SQL_USER,
      password: process.env.SQL_PASS
    }
  },
  options: {
    encrypt: true,
    database: process.env.SQL_DB
  }
}

export async function runSQL (sql: string) : Promise<ColumnValue[]> {
  return new Promise<ColumnValue[]>((resolve: any, reject: any) => {
    function sendRequest (sql: string) {
      const request: TediousRequest = new TediousRequest(sql, function (err) {
        if (err) {
          reject(err)
        }
      })
      let data: ColumnValue[]
      request.on('row', (columns) => {
        data = columns
      })
      request.on('requestCompleted', function () {
        resolve(data)
        connection.close()
      })
      connection.execSql(request)
    }
    const connection = new TediousConnection(config)
    connection.on('connect', function (err: any) {
      if (err != null) {
        reject(err)
      }
      sendRequest(sql)
    })
    connection.connect()
  })
}
