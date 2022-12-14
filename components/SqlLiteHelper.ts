import { enablePromise, openDatabase } from "react-native-sqlite-storage";
import { DB_FILE_NAME, HOST_TABLE, HOST_TB_CREATE_AT, HOST_TB_ID, HOST_TB_VALUE, TOKEN_TABLE, TOKEN_TB_CREATE_AT, TOKEN_TB_ID, TOKEN_TB_VALUE } from "./Constant";

const OpenDBSuccess = function() {
	console.info("Open DB ok");
}

const OpenDBFail = function() {
	console.error("Open DB fail");
}

const db = openDatabase({name: DB_FILE_NAME, location: "default"}, OpenDBSuccess, OpenDBFail);

(function initDatabase() {
	enablePromise(true);
	const CREATE_TOKEN_DATABASE_SQL = `CREATE TABLE IF NOT EXISTS ${TOKEN_TABLE} (
		${TOKEN_TB_ID} INTEGER PRIMARY KEY AUTOINCREMENT,
		${TOKEN_TB_VALUE} LONGTEXT,
		${TOKEN_TB_CREATE_AT} DATETIME DEFAULT CURRENT_TIMESTAMP
	)`;
	const CREATE_HOST_DATABASE_SQL = `CREATE TABLE IF NOT EXISTS ${HOST_TABLE} (
		${HOST_TB_ID} INTEGER PRIMARY KEY AUTOINCREMENT,
		${HOST_TB_VALUE} LONGTEXT,
		${HOST_TB_CREATE_AT} DATETIME DEFAULT CURRENT_TIMESTAMP
	)`;

	db.transaction(function(tx: any) {
		tx.executeSql(CREATE_HOST_DATABASE_SQL);
		tx.executeSql(CREATE_TOKEN_DATABASE_SQL);
	});
})();

export const SaveToken = function(token: string) {
	const SQL = `DELETE FROM ${TOKEN_TABLE}`;
	return new Promise(function (resolve, reject) {
		db.transaction(function(tx: any) {
			tx.executeSql(SQL, [], function(tx: any) {
				const SQL1 = `INSERT INTO ${TOKEN_TABLE} (${TOKEN_TB_VALUE}) VALUES (?)`;
				tx.executeSql(SQL1, [token], function(tx1: any, result: any) {
					resolve(result);
				})
			}, function(tx: any, error: any) {
				reject(error);
			});
		});
	});
}

export const LoadToken = function() {
	const SQL = `SELECT * FROM ${TOKEN_TABLE}`;
	return new Promise(function (resolve, reject) {
		db.transaction(function(tx: any) {
			tx.executeSql(SQL, [], function(tx: any, result: any) {
				resolve(result);
			}, function(tx: any, error: any) {
				reject(error);
			});
		});
	});
}

export const ClearToken = function() {
	const SQL = `DELETE FROM ${TOKEN_TABLE}`;
	return new Promise(function (resolve, reject) {
		db.transaction(function(tx: any) {
			tx.executeSql(SQL, [], function(tx: any, result: any) {
				resolve(result);
			}, function(tx: any, error: any) {
				reject(error);
			});
		});
	});
}