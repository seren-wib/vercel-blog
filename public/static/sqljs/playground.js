/*
 * COMPANY SQL playground.
 * One file shared by the standalone page (practice/company/sql-playground.html)
 * and the blog (public/static/sqljs/playground.js).
 *
 * Usage:
 *   SqlPlayground.mount(element, { initSqlJs, locateFile, lang: 'kr' | 'en' })
 * initSqlJs comes from sql.js (sql-wasm.js); locateFile points at sql-wasm.wasm.
 */
;(function (global) {
  'use strict'

  var SETUP = [
    "CREATE TABLE EMPLOYEE ( Fname VARCHAR(15) NOT NULL, Minit CHAR, Lname VARCHAR(15) NOT NULL, Ssn CHAR(9) NOT NULL, Bdate DATE, Address VARCHAR(30), Sex CHAR, Salary DECIMAL(10,2), Super_ssn CHAR(9), Dno INT NOT NULL DEFAULT 1,",
    "  CONSTRAINT EMPPK PRIMARY KEY (Ssn),",
    "  CONSTRAINT EMPSUPERFK FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn) ON DELETE SET NULL ON UPDATE CASCADE,",
    "  CONSTRAINT EMPDEPTFK FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber) ON DELETE SET DEFAULT ON UPDATE CASCADE );",
    "CREATE TABLE DEPARTMENT ( Dname VARCHAR(15) NOT NULL, Dnumber INT NOT NULL, Mgr_ssn CHAR(9) NOT NULL DEFAULT '888665555', Mgr_start_date DATE,",
    "  CONSTRAINT DEPTPK PRIMARY KEY (Dnumber), CONSTRAINT DEPTSK UNIQUE (Dname),",
    "  CONSTRAINT DEPTMGRFK FOREIGN KEY (Mgr_ssn) REFERENCES EMPLOYEE(Ssn) ON DELETE SET DEFAULT ON UPDATE CASCADE );",
    "CREATE TABLE DEPT_LOCATIONS ( Dnumber INT NOT NULL, Dlocation VARCHAR(15) NOT NULL,",
    "  CONSTRAINT DLOCPK PRIMARY KEY (Dnumber, Dlocation),",
    "  CONSTRAINT DLOCDEPTFK FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber) ON DELETE CASCADE ON UPDATE CASCADE );",
    "CREATE TABLE PROJECT ( Pname VARCHAR(15) NOT NULL, Pnumber INT NOT NULL, Plocation VARCHAR(15), Dnum INT NOT NULL,",
    "  CONSTRAINT PROJPK PRIMARY KEY (Pnumber), CONSTRAINT PROJSK UNIQUE (Pname),",
    "  CONSTRAINT PROJDEPTFK FOREIGN KEY (Dnum) REFERENCES DEPARTMENT(Dnumber) );",
    "CREATE TABLE WORKS_ON ( Essn CHAR(9) NOT NULL, Pno INT NOT NULL, Hours DECIMAL(3,1),",
    "  CONSTRAINT WOPK PRIMARY KEY (Essn, Pno),",
    "  CONSTRAINT WOEMPFK FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn),",
    "  CONSTRAINT WOPROJFK FOREIGN KEY (Pno) REFERENCES PROJECT(Pnumber) );",
    "CREATE TABLE DEPENDENT ( Essn CHAR(9) NOT NULL, Dependent_name VARCHAR(15) NOT NULL, Sex CHAR, Bdate DATE, Relationship VARCHAR(8),",
    "  CONSTRAINT DEPNTPK PRIMARY KEY (Essn, Dependent_name),",
    "  CONSTRAINT DEPNTEMPFK FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn) );",
    "INSERT INTO EMPLOYEE VALUES ('John','B','Smith','123456789','1965-01-09','731 Fondren, Houston, TX','M',30000,'333445555',5);",
    "INSERT INTO EMPLOYEE VALUES ('Franklin','T','Wong','333445555','1955-12-08','638 Voss, Houston, TX','M',40000,'888665555',5);",
    "INSERT INTO EMPLOYEE VALUES ('Alicia','J','Zelaya','999887777','1968-01-19','3321 Castle, Spring, TX','F',25000,'987654321',4);",
    "INSERT INTO EMPLOYEE VALUES ('Jennifer','S','Wallace','987654321','1941-06-20','291 Berry, Bellaire, TX','F',43000,'888665555',4);",
    "INSERT INTO EMPLOYEE VALUES ('Ramesh','K','Narayan','666884444','1962-09-15','975 Fire Oak, Humble, TX','M',38000,'333445555',5);",
    "INSERT INTO EMPLOYEE VALUES ('Joyce','A','English','453453453','1972-07-31','5631 Rice, Houston, TX','F',25000,'333445555',5);",
    "INSERT INTO EMPLOYEE VALUES ('Ahmad','V','Jabbar','987987987','1969-03-29','980 Dallas, Houston, TX','M',25000,'987654321',4);",
    "INSERT INTO EMPLOYEE VALUES ('James','E','Borg','888665555','1937-11-10','450 Stone, Houston, TX','M',55000,NULL,1);",
    "INSERT INTO DEPARTMENT VALUES ('Research',5,'333445555','1988-05-22');",
    "INSERT INTO DEPARTMENT VALUES ('Administration',4,'987654321','1995-01-01');",
    "INSERT INTO DEPARTMENT VALUES ('Headquarters',1,'888665555','1981-06-19');",
    "INSERT INTO DEPT_LOCATIONS VALUES (1,'Houston'),(4,'Stafford'),(5,'Bellaire'),(5,'Sugarland'),(5,'Houston');",
    "INSERT INTO PROJECT VALUES ('ProductX',1,'Bellaire',5),('ProductY',2,'Sugarland',5),('ProductZ',3,'Houston',5),('Computerization',10,'Stafford',4),('Reorganization',20,'Houston',1),('Newbenefits',30,'Stafford',4);",
    "INSERT INTO WORKS_ON VALUES ('123456789',1,32.5),('123456789',2,7.5),('666884444',3,40.0),('453453453',1,20.0),('453453453',2,20.0),('333445555',2,10.0),('333445555',3,10.0),('333445555',10,10.0),('333445555',20,10.0),('999887777',30,30.0),('999887777',10,10.0),('987987987',10,35.0),('987987987',30,5.0),('987654321',30,20.0),('987654321',20,15.0),('888665555',20,NULL);",
    "INSERT INTO DEPENDENT VALUES ('333445555','Alice','F','1986-04-05','Daughter'),('333445555','Theodore','M','1983-10-25','Son'),('333445555','Joy','F','1958-05-03','Spouse'),('987654321','Abner','M','1942-02-28','Spouse'),('123456789','Michael','M','1988-01-04','Son'),('123456789','Alice','F','1988-12-30','Daughter'),('123456789','Elizabeth','F','1967-05-05','Spouse');"
  ].join('\n')

  var BASE_TABLES = ['EMPLOYEE', 'DEPARTMENT', 'DEPT_LOCATIONS', 'PROJECT', 'WORKS_ON', 'DEPENDENT']

  // [section, kr title, en title, sql]
  var QUERIES = [
    ['1', '새 테이블 만들고 행 넣기 (FK 위반 포함)', 'Create a table and insert rows (with an FK violation)',
      "CREATE TABLE OFFICE\n  ( Dnumber  INT          NOT NULL,\n    Room     VARCHAR(10)  NOT NULL,\n  CONSTRAINT OFFPK     PRIMARY KEY (Dnumber, Room),\n  CONSTRAINT OFFDEPTFK FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber)\n                       ON DELETE CASCADE );\n\nINSERT INTO OFFICE VALUES (5, 'E-101');\nINSERT INTO OFFICE VALUES (7, 'E-102');"],
    ['1', 'ON DELETE 동작: 부서 6 만들었다 지우기', 'ON DELETE in action: add department 6, then delete it',
      "INSERT INTO DEPARTMENT VALUES ('Marketing', 6, '453453453', '2026-01-01');\nINSERT INTO DEPT_LOCATIONS VALUES (6, 'Austin');\nUPDATE EMPLOYEE SET Dno = 6 WHERE Ssn = '453453453';\n\nDELETE FROM DEPARTMENT WHERE Dnumber = 6;"],
    ['2', 'INSERT: 열 전부', 'INSERT: every column',
      "INSERT INTO EMPLOYEE\nVALUES ('Richard', 'K', 'Marini', '653298653', '1962-12-30',\n        '98 Oak Forest, Katy, TX', 'M', 37000, '653298653', 4);"],
    ['2', 'INSERT: 고른 열만', 'INSERT: chosen columns only',
      "INSERT INTO EMPLOYEE (Fname, Lname, Dno, Ssn)\nVALUES ('Richard', 'Marini', 4, '653298653');"],
    ['2', 'INSERT 거부: 없는 부서, 겹치는 Ssn', 'Rejected INSERT: missing department, duplicate Ssn',
      "INSERT INTO EMPLOYEE (Fname, Lname, Dno, Ssn)\nVALUES ('Mina', 'Jung', 7, '111111111');"],
    ['2', 'DELETE 거부: 남이 가리키는 직원', 'Rejected DELETE: an employee others point to',
      "DELETE FROM EMPLOYEE WHERE Ssn = '123456789';"],
    ['2', 'DELETE 통과: 가리키는 행부터 지우기', 'DELETE that works: remove the referencing rows first',
      "DELETE FROM WORKS_ON  WHERE Essn = '123456789';\nDELETE FROM DEPENDENT WHERE Essn = '123456789';\nDELETE FROM EMPLOYEE  WHERE Ssn  = '123456789';"],
    ['2', 'UPDATE: 프로젝트 위치·부서', 'UPDATE: project location and department',
      "UPDATE PROJECT\nSET    Plocation = 'Bellaire', Dnum = 5\nWHERE  Pnumber = 10;"],
    ['2', 'UPDATE: 5번 부서 급여 10% 인상', 'UPDATE: 10% raise for department 5',
      "UPDATE EMPLOYEE\nSET    Salary = Salary * 1.1\nWHERE  Dno = 5;"],
    ['2', 'ON UPDATE: 부서 번호 1 → 7 (CASCADE 없는 FK가 막음)', 'ON UPDATE: department 1 → 7 (an FK without CASCADE blocks it)',
      "-- PROJECT.Dnum엔 ON UPDATE가 없어서 Reorganization(Dnum 1)이 막음\nUPDATE DEPARTMENT SET Dnumber = 7 WHERE Dnumber = 1;"],
    ['2', 'ON UPDATE CASCADE: 막는 행 옮기고 다시', 'ON UPDATE CASCADE: move the blocking row, then retry',
      "UPDATE PROJECT    SET Dnum = 5    WHERE Dnum = 1;\n\n-- EMPLOYEE.Dno, DEPT_LOCATIONS.Dnumber는 ON UPDATE CASCADE라 같이 7로 바뀜\nUPDATE DEPARTMENT SET Dnumber = 7 WHERE Dnumber = 1;"],
    ['3', 'John B Smith의 생일·주소', 'Birth date and address of John B Smith',
      "SELECT Bdate, Address\nFROM   EMPLOYEE\nWHERE  Fname = 'John' AND Minit = 'B' AND Lname = 'Smith';"],
    ['3', 'Research 부서 직원 (테이블 둘 잇기)', 'Employees of Research (joining two tables)',
      "SELECT Fname, Lname, Address\nFROM   EMPLOYEE, DEPARTMENT\nWHERE  Dname = 'Research' AND Dnumber = Dno;"],
    ['3', '잇는 조건 빼먹으면', 'What happens without the join condition',
      "SELECT Fname, Dname\nFROM   EMPLOYEE, DEPARTMENT;"],
    ['3', '직원과 상사 이름 (같은 테이블 두 번)', 'Employee and supervisor names (same table twice)',
      "SELECT E.Fname, E.Lname, S.Fname, S.Lname\nFROM   EMPLOYEE AS E, EMPLOYEE AS S\nWHERE  E.Super_ssn = S.Ssn;"],
    ['3', 'ProductX 직원 급여 10% 올리면', 'ProductX workers with a 10% raise',
      "SELECT E.Fname, E.Lname, 1.1 * E.Salary AS Increased_sal\nFROM   EMPLOYEE AS E, WORKS_ON AS W, PROJECT AS P\nWHERE  E.Ssn = W.Essn AND W.Pno = P.Pnumber AND P.Pname = 'ProductX';"],
    ['3', 'DISTINCT: 급여 종류', 'DISTINCT: salary values',
      "SELECT DISTINCT Salary\nFROM   EMPLOYEE;"],
    ['3', 'ORDER BY: 부서 내림차순, 이름 오름차순', 'ORDER BY: department desc, name asc',
      "SELECT D.Dname, E.Lname, E.Fname\nFROM   DEPARTMENT AS D, EMPLOYEE AS E\nWHERE  D.Dnumber = E.Dno\nORDER BY D.Dname DESC, E.Lname ASC, E.Fname ASC;"],
    ['3', 'UNION: Smith가 관리하거나 일하는 프로젝트', 'UNION: projects Smith manages or works on',
      "-- 교재는 ( SELECT … ) UNION ( SELECT … ). SQLite는 괄호를 안 받아서 뺌\nSELECT DISTINCT Pnumber\nFROM   PROJECT, DEPARTMENT, EMPLOYEE\nWHERE  Dnum = Dnumber AND Mgr_ssn = Ssn AND Lname = 'Smith'\nUNION\nSELECT DISTINCT Pnumber\nFROM   PROJECT, WORKS_ON, EMPLOYEE\nWHERE  Pnumber = Pno AND Essn = Ssn AND Lname = 'Smith';"],
    ['4', 'IN: 위 UNION을 중첩 질의로', 'IN: the UNION above as nested queries',
      "SELECT DISTINCT Pnumber\nFROM   PROJECT\nWHERE  Pnumber IN ( SELECT Pnumber\n                    FROM   PROJECT, DEPARTMENT, EMPLOYEE\n                    WHERE  Dnum = Dnumber AND Mgr_ssn = Ssn AND Lname = 'Smith' )\n    OR Pnumber IN ( SELECT Pno\n                    FROM   WORKS_ON, EMPLOYEE\n                    WHERE  Essn = Ssn AND Lname = 'Smith' );"],
    ['4', '> ALL: 5번 부서 전원보다 많이 받는 직원', '> ALL: paid more than everyone in department 5',
      "-- 표준: WHERE Salary > ALL ( SELECT Salary FROM EMPLOYEE WHERE Dno = 5 )\n-- SQLite엔 ALL이 없어서 \"전부보다 크다\" = \"최댓값보다 크다\"로\nSELECT Fname, Lname, Salary\nFROM   EMPLOYEE\nWHERE  Salary > ( SELECT MAX(Salary) FROM EMPLOYEE WHERE Dno = 5 );"],
    ['4', '바깥 별명 쓰는 중첩: 이름·성별 같은 부양가족', 'Correlated: a dependent with the same name and sex',
      "SELECT E.Fname, E.Lname\nFROM   EMPLOYEE AS E\nWHERE  E.Ssn IN ( SELECT D.Essn\n                  FROM   DEPENDENT AS D\n                  WHERE  E.Fname = D.Dependent_name AND E.Sex = D.Sex );"],
    ['4', 'NOT EXISTS: 부양가족 없는 직원', 'NOT EXISTS: employees with no dependents',
      "SELECT Fname, Lname\nFROM   EMPLOYEE\nWHERE  NOT EXISTS ( SELECT * FROM DEPENDENT WHERE Ssn = Essn );"],
    ['4', 'EXISTS 둘: 부양가족 있는 관리자', 'Two EXISTS: managers with dependents',
      "SELECT Fname, Lname\nFROM   EMPLOYEE\nWHERE  EXISTS ( SELECT * FROM DEPENDENT  WHERE Ssn = Essn )\n  AND  EXISTS ( SELECT * FROM DEPARTMENT WHERE Ssn = Mgr_ssn );"],
    ['4', '전부에 참여: 4번 부서 프로젝트 전부 하는 직원', 'All of: employees on every project of department 4',
      "-- 교재는 ( SELECT … ) EXCEPT ( SELECT … ). SQLite용으로 괄호만 뺌\n-- 5번 부서로 바꿔보면 0행 (전부 하는 사람 없음)\nSELECT Fname, Lname\nFROM   EMPLOYEE\nWHERE  NOT EXISTS ( SELECT Pnumber FROM PROJECT WHERE Dnum = 4\n                    EXCEPT\n                    SELECT Pno FROM WORKS_ON WHERE Essn = Ssn );"],
    ['5', 'JOIN … ON', 'JOIN … ON',
      "SELECT Fname, Lname, Address\nFROM   (EMPLOYEE JOIN DEPARTMENT ON Dno = Dnumber)\nWHERE  Dname = 'Research';"],
    ['5', 'LEFT OUTER JOIN: 상사 없는 Borg도', 'LEFT OUTER JOIN: Borg without a supervisor too',
      "SELECT E.Fname, E.Lname, S.Fname, S.Lname\nFROM   (EMPLOYEE AS E LEFT OUTER JOIN EMPLOYEE AS S ON E.Super_ssn = S.Ssn);"],
    ['6', '집계: Research 부서 급여 합·최대·최소·평균', 'Aggregates: Research salaries',
      "SELECT SUM(Salary), MAX(Salary), MIN(Salary), AVG(Salary)\nFROM   (EMPLOYEE JOIN DEPARTMENT ON Dno = Dnumber)\nWHERE  Dname = 'Research';"],
    ['6', 'GROUP BY: 부서별 인원·평균 급여', 'GROUP BY: head count and average salary per department',
      "SELECT   Dno, COUNT(*), AVG(Salary)\nFROM     EMPLOYEE\nGROUP BY Dno;"],
    ['6', 'HAVING: 3명 이상 일하는 프로젝트', 'HAVING: projects with three or more workers',
      "SELECT   Pnumber, Pname, COUNT(*)\nFROM     PROJECT, WORKS_ON\nWHERE    Pnumber = Pno\nGROUP BY Pnumber, Pname\nHAVING   COUNT(*) > 2;"],
    ['6', 'WHERE 안 집계: 부양가족 2명 이상', 'Aggregate in WHERE: two or more dependents',
      "SELECT Fname, Lname\nFROM   EMPLOYEE\nWHERE  ( SELECT COUNT(*) FROM DEPENDENT WHERE Ssn = Essn ) >= 2;"],
    ['7', 'ASSERTION 흉내: 부서장보다 많이 받게 바꾸면', 'ASSERTION, simulated: pay someone more than their manager',
      "-- SQLite엔 CREATE ASSERTION이 없어서 CHECK 안쪽 SELECT(어기는 행 찾기)를 직접 돌림\n-- 0행이면 규칙 만족, 1행 이상이면 ASSERTION이 그 변경을 거부했을 것\nUPDATE EMPLOYEE SET Salary = 45000 WHERE Ssn = '123456789';\n\nSELECT E.Fname, E.Salary, M.Fname AS Manager, M.Salary AS Manager_salary\nFROM   EMPLOYEE E, EMPLOYEE M, DEPARTMENT D\nWHERE  E.Salary > M.Salary\n  AND  E.Dno = D.Dnumber\n  AND  D.Mgr_ssn = M.Ssn;"],
    ['7', 'TRIGGER: 상사보다 많이 받으면 알림 남기기', 'TRIGGER: leave a notice when someone out-earns their supervisor',
      "-- 교재의 INFORM_SUPERVISOR(…) 대신 NOTICE 테이블에 한 줄 남기게 바꿈 (SQLite 문법)\nCREATE TABLE NOTICE ( Supervisor_ssn CHAR(9), Ssn CHAR(9) );\n\nCREATE TRIGGER SALARY_VIOLATION\nAFTER UPDATE OF Salary, Super_ssn ON EMPLOYEE\nFOR EACH ROW\nWHEN ( NEW.Salary > ( SELECT Salary FROM EMPLOYEE WHERE Ssn = NEW.Super_ssn ) )\nBEGIN\n  INSERT INTO NOTICE VALUES (NEW.Super_ssn, NEW.Ssn);\nEND;\n\nUPDATE EMPLOYEE SET Salary = 45000 WHERE Ssn = '123456789';"],
    ['8', 'VIEW: WORKS_ON1 만들고 조회', 'VIEW: create WORKS_ON1 and query it',
      "CREATE VIEW WORKS_ON1\nAS SELECT Fname, Lname, Pname, Hours\n   FROM   EMPLOYEE, PROJECT, WORKS_ON\n   WHERE  Ssn = Essn AND Pno = Pnumber;\n\nSELECT Fname, Lname\nFROM   WORKS_ON1\nWHERE  Pname = 'ProductX';"],
    ['8', 'VIEW: 열 이름 붙인 DEPT_INFO', 'VIEW: DEPT_INFO with named columns',
      "CREATE VIEW DEPT_INFO(Dept_name, No_of_emps, Total_sal)\nAS SELECT   Dname, COUNT(*), SUM(Salary)\n   FROM     DEPARTMENT, EMPLOYEE\n   WHERE    Dnumber = Dno\n   GROUP BY Dname;\n\nSELECT * FROM DEPT_INFO;"],
    ['8', '뷰 갱신 거부: join 뷰에 UPDATE', 'Rejected view update: UPDATE on a join view',
      "CREATE VIEW WORKS_ON1\nAS SELECT Fname, Lname, Pname, Hours\n   FROM   EMPLOYEE, PROJECT, WORKS_ON\n   WHERE  Ssn = Essn AND Pno = Pnumber;\n\nUPDATE WORKS_ON1\nSET    Pname = 'ProductY'\nWHERE  Lname = 'Smith' AND Pname = 'ProductX';"]
  ]

  var SECTIONS = {
    kr: { '1': '1. 테이블 만들기', '2': '2. 넣기·지우기·고치기', '3': '3. SELECT', '4': '4. 중첩 질의', '5': '5. JOIN', '6': '6. 집계', '7': '7. ASSERTION·TRIGGER', '8': '8. 뷰' },
    en: { '1': '1. Creating tables', '2': '2. Insert, delete, update', '3': '3. SELECT', '4': '4. Nested queries', '5': '5. JOIN', '6': '6. Aggregates', '7': '7. ASSERTION, TRIGGER', '8': '8. Views' }
  }

  var T = {
    kr: {
      loading: 'SQLite 불러오는 중…',
      loadFail: 'SQLite를 못 불러왔어. 인터넷 연결을 확인하고 새로고침해.',
      pick: '예제 쿼리',
      run: '실행',
      reset: '처음 상태로',
      hint: 'Ctrl+Enter(맥은 ⌘+Enter)로도 실행. 실행한 변경은 계속 쌓이고, 처음 상태로 누르면 COMPANY 시작 데이터로 돌아감.',
      result: '실행 결과',
      tables: '테이블',
      tablesHint: '마지막 실행에서 바뀐 칸은 옛 값 → 새 값, 새 행은 색칠, 지운 행은 취소선. 밑줄 = PK, → = FK가 가리키는 곳',
      rows: function (n) { return n + '행' },
      noRows: '0행. 조건에 맞는 행이 없음',
      changed: function (parts) { return parts.join(', ') },
      added: '추가', updated: '바뀜', deleted: '삭제',
      nochange: '실행됨. 바뀐 행 없음',
      created: function (n) { return n + ' 만들어짐' },
      stopped: '여기서 멈춤. 앞 문장들은 이미 실행됨',
      empty: '쿼리를 입력해.',
      view: '뷰',
      viewNote: '뷰는 저장 안 됨. 볼 때마다 원본 테이블에서 계산',
      errors: [
        [/FOREIGN KEY constraint failed/, { INSERT: '거부: 참조 무결성 위반. 넣는 FK 값이 상대 테이블 PK에 없음', UPDATE: '거부: 참조 무결성 위반. 바꾼 FK 값이 상대 테이블 PK에 없거나, 바꾼 PK를 다른 테이블이 가리키는데 그 FK에 ON UPDATE CASCADE가 없음', DELETE: '거부: 참조 무결성 위반. 지우는 행을 다른 테이블이 FK로 가리키는데 그 FK에 ON DELETE가 없음 (안 쓰면 거부)' }],
        [/UNIQUE constraint failed: (.*)/, '거부: Key 제약 위반. $1 값이 이미 있음'],
        [/NOT NULL constraint failed: (.*)/, '거부: NOT NULL 위반. $1 칸이 비어 있음'],
        [/cannot modify (\w+) because it is a view/, '거부: $1은 뷰라서 직접 못 고침. 여러 테이블 join 뷰는 어느 원본을 고칠지 정할 수 없음'],
        [/(?:table|view|trigger|index) (\w+) already exists/, '$1이 이미 있음. 처음 상태로 누르고 다시 실행해'],
        [/no such table: (.*)/, '$1 테이블이 없음. 이름 확인'],
        [/no such column: (.*)/, '$1 열이 없음. 이름이나 어느 테이블 열인지 확인'],
        [/ambiguous column name: (.*)/, '$1이 두 테이블에 다 있음. 테이블명.열 또는 별명.열로 써'],
        [/near "(.*)": syntax error/, '문법 오류: "$1" 근처'],
        [/incomplete input/, '문장이 덜 끝났음. 괄호나 따옴표 확인']
      ]
    },
    en: {
      loading: 'Loading SQLite…',
      loadFail: 'Could not load SQLite. Check your connection and reload.',
      pick: 'Example query',
      run: 'Run',
      reset: 'Reset data',
      hint: 'Ctrl+Enter (⌘+Enter on Mac) also runs. Changes build up across runs; Reset data brings back the starting COMPANY data.',
      result: 'Result',
      tables: 'Tables',
      tablesHint: 'Cells changed by the last run show old → new, new rows are tinted, deleted rows are struck through. Underline = PK, → = where an FK points',
      rows: function (n) { return n + (n === 1 ? ' row' : ' rows') },
      noRows: '0 rows. Nothing matches',
      changed: function (parts) { return parts.join(', ') },
      added: 'added', updated: 'changed', deleted: 'deleted',
      nochange: 'Done. No rows changed',
      created: function (n) { return n + ' created' },
      stopped: 'Stopped here. Earlier statements already ran',
      empty: 'Type a query.',
      view: 'view',
      viewNote: 'A view is not stored; it is computed from the base tables each time',
      errors: [
        [/FOREIGN KEY constraint failed/, { INSERT: 'Rejected: referential integrity. The FK value is not a PK in the other table', UPDATE: 'Rejected: referential integrity. The new FK value is not a PK in the other table, or another table points to the changed PK and that FK has no ON UPDATE CASCADE', DELETE: 'Rejected: referential integrity. Another table points to this row and that FK has no ON DELETE action (none means reject)' }],
        [/UNIQUE constraint failed: (.*)/, 'Rejected: key constraint. $1 already has that value'],
        [/NOT NULL constraint failed: (.*)/, 'Rejected: NOT NULL. $1 is empty'],
        [/cannot modify (\w+) because it is a view/, 'Rejected: $1 is a view. A join view cannot tell which base table to change'],
        [/(?:table|view|trigger|index) (\w+) already exists/, '$1 already exists. Press Reset data and run again'],
        [/no such table: (.*)/, 'No table named $1'],
        [/no such column: (.*)/, 'No column named $1'],
        [/ambiguous column name: (.*)/, '$1 is in both tables. Write table.column or alias.column'],
        [/near "(.*)": syntax error/, 'Syntax error near "$1"'],
        [/incomplete input/, 'The statement is not finished. Check brackets and quotes']
      ]
    }
  }

  var CSS = [
    '.sqlpg{--pg-bg:#ffffff;--pg-fg:#18181b;--pg-muted:#6b6b76;--pg-line:#d9d9de;--pg-soft:#f4f4f6;--pg-head:#ececf0;--pg-pk:#fbefc6;--pg-fk:#dfeaf8;--pg-add:#e2f3e6;--pg-chg:#fff1c2;--pg-err:#b4232c;--pg-errbg:#fdecec;--pg-accent:#18181b;--pg-accentfg:#ffffff;',
    'color:var(--pg-fg);font-size:14px;line-height:1.5;display:flex;flex-direction:column;gap:14px;margin:1.5em 0}',
    '.dark .sqlpg,.sqlpg[data-theme="dark"]{--pg-bg:#111114;--pg-fg:#ececf0;--pg-muted:#9a9aa6;--pg-line:#33333b;--pg-soft:#1b1b20;--pg-head:#24242b;--pg-pk:#4a3f16;--pg-fk:#1d3350;--pg-add:#173a22;--pg-chg:#4a3d0e;--pg-err:#ff8b8b;--pg-errbg:#3a1416;--pg-accent:#ececf0;--pg-accentfg:#111114}',
    '.sqlpg *{box-sizing:border-box}',
    '.sqlpg .pg-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center}',
    '.sqlpg select,.sqlpg button,.sqlpg textarea{font:inherit;color:var(--pg-fg)}',
    '.sqlpg select{flex:1 1 260px;min-width:0;padding:7px 9px;border:1px solid var(--pg-line);border-radius:6px;background:var(--pg-bg)}',
    '.sqlpg button{padding:7px 14px;border-radius:6px;border:1px solid var(--pg-line);background:var(--pg-bg);cursor:pointer}',
    '.sqlpg button.pg-run{background:var(--pg-accent);color:var(--pg-accentfg);border-color:var(--pg-accent);font-weight:600}',
    '.sqlpg button:focus-visible,.sqlpg select:focus-visible,.sqlpg textarea:focus-visible{outline:2px solid var(--pg-fg);outline-offset:2px}',
    '.sqlpg textarea{width:100%;min-height:190px;resize:vertical;padding:12px;border:1px solid var(--pg-line);border-radius:8px;background:var(--pg-soft);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13px;line-height:1.55;tab-size:2;white-space:pre}',
    '.sqlpg .pg-hint{color:var(--pg-muted);font-size:12.5px;margin:0}',
    '.sqlpg h4{margin:4px 0 0;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--pg-muted)}',
    '.sqlpg .pg-out{display:flex;flex-direction:column;gap:12px}',
    '.sqlpg .pg-stmt{border:1px solid var(--pg-line);border-radius:8px;padding:10px 12px;display:flex;flex-direction:column;gap:8px;min-width:0}',
    '.sqlpg .pg-stmt code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;color:var(--pg-muted);white-space:pre-wrap;word-break:break-word}',
    '.sqlpg .pg-msg{font-weight:600}',
    '.sqlpg .pg-err{color:var(--pg-err);background:var(--pg-errbg);border-radius:6px;padding:8px 10px;font-weight:600}',
    '.sqlpg .pg-raw{font-weight:400;font-size:12px;opacity:.8;display:block;margin-top:2px;font-family:ui-monospace,Menlo,monospace}',
    '.sqlpg .pg-scroll{overflow-x:auto;max-width:100%}',
    '.sqlpg table{border-collapse:collapse;font-size:12.5px;font-variant-numeric:tabular-nums;margin:0;width:auto}',
    '.sqlpg th,.sqlpg td{border:1px solid var(--pg-line);padding:4px 8px;text-align:left;white-space:nowrap;vertical-align:top}',
    '.sqlpg th{background:var(--pg-head);font-weight:600}',
    '.sqlpg th.pk{background:var(--pg-pk)}',
    '.sqlpg th.fk{background:var(--pg-fk)}',
    '.sqlpg th.pk.fk{background:linear-gradient(135deg,var(--pg-pk) 50%,var(--pg-fk) 50%)}',
    '.sqlpg th .pg-colname{display:block}',
    '.sqlpg th.pk .pg-colname{text-decoration:underline}',
    '.sqlpg th .pg-ref{display:block;font-weight:400;font-size:11px;color:var(--pg-muted)}',
    '.sqlpg td.null{color:var(--pg-muted);font-style:italic}',
    '.sqlpg tr.added td{background:var(--pg-add);font-weight:600}',
    '.sqlpg tr.deleted td{color:var(--pg-muted);text-decoration:line-through}',
    '.sqlpg td.chg{background:var(--pg-chg);font-weight:600}',
    '.sqlpg td.chg s{font-weight:400;color:var(--pg-muted);margin-right:4px}',
    '.sqlpg .pg-tabs{display:flex;flex-wrap:wrap;gap:6px}',
    '.sqlpg .pg-tab{padding:4px 10px;font-size:12.5px;border-radius:999px}',
    '.sqlpg .pg-tab[aria-selected="true"]{background:var(--pg-accent);color:var(--pg-accentfg);border-color:var(--pg-accent)}',
    '.sqlpg .pg-tab .pg-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#d97706;margin-left:6px;vertical-align:middle}',
    '.sqlpg .pg-tabpanel{display:flex;flex-direction:column;gap:8px}',
    '@media (prefers-reduced-motion:no-preference){.sqlpg tr.added td,.sqlpg td.chg{transition:background .3s}}'
  ].join('\n')

  function el(tag, attrs, kids) {
    var e = document.createElement(tag)
    if (attrs) for (var k in attrs) {
      if (k === 'text') e.textContent = attrs[k]
      else if (k === 'class') e.className = attrs[k]
      else e.setAttribute(k, attrs[k])
    }
    if (kids) kids.forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c) })
    return e
  }

  function fmt(v) {
    if (v === null || v === undefined) return 'NULL'
    if (typeof v === 'number' && !Number.isInteger(v)) return String(Math.round(v * 100) / 100)
    if (v instanceof Uint8Array) return '[blob]'
    return String(v)
  }

  function explain(msg, t, sql) {
    var kind = ((sql || '').replace(/^(\s*--[^\n]*\n)+/, '').trim().split(/\s+/)[0] || '').toUpperCase()
    for (var i = 0; i < t.errors.length; i++) {
      var m = msg.match(t.errors[i][0])
      if (m) {
        var tpl = t.errors[i][1]
        if (typeof tpl === 'object') tpl = tpl[kind] || tpl.DELETE
        return tpl.replace(/\$1/g, m[1] || '')
      }
    }
    return msg
  }

  function objects(db) {
    var r = db.exec("SELECT name, type FROM sqlite_master WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%' ORDER BY rowid")
    if (!r.length) return []
    var list = r[0].values.map(function (v) { return { name: v[0], type: v[1] } })
    list.sort(function (a, b) {
      var ia = BASE_TABLES.indexOf(a.name), ib = BASE_TABLES.indexOf(b.name)
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib)
    })
    return list
  }

  function meta(db, name) {
    var cols = db.exec('PRAGMA table_info("' + name + '")')
    var fks = db.exec('PRAGMA foreign_key_list("' + name + '")')
    var info = {}
    if (cols.length) cols[0].values.forEach(function (c) { info[c[1]] = { pk: c[5] > 0, ref: null } })
    if (fks.length) fks[0].values.forEach(function (f) { if (info[f[3]]) info[f[3]].ref = f[2] + '.' + f[4] })
    return info
  }

  function masterNames(db) {
    var r = db.exec("SELECT name FROM sqlite_master WHERE name NOT LIKE 'sqlite_%'")
    return r.length ? r[0].values.map(function (v) { return v[0] }) : []
  }

  function snapshot(db) {
    var s = {}
    objects(db).forEach(function (o) {
      var sql = o.type === 'table' ? 'SELECT rowid AS __rid, * FROM "' + o.name + '"' : 'SELECT * FROM "' + o.name + '"'
      var r
      try { r = db.exec(sql) } catch (e) { r = [] }
      var cols = r.length ? r[0].columns : null
      if (!cols) {
        var p = db.exec('PRAGMA table_info("' + o.name + '")')
        cols = (o.type === 'table' ? ['__rid'] : []).concat(p.length ? p[0].values.map(function (c) { return c[1] }) : [])
      }
      var rows = {}, order = []
      ;(r.length ? r[0].values : []).forEach(function (v, i) {
        var key = o.type === 'table' ? v[0] : 'v' + i
        rows[key] = o.type === 'table' ? v.slice(1) : v
        order.push(key)
      })
      s[o.name] = { type: o.type, cols: o.type === 'table' ? cols.slice(1) : cols, rows: rows, order: order }
    })
    return s
  }

  function diff(a, b) {
    var out = {}
    Object.keys(b).forEach(function (name) {
      var B = b[name], A = a[name]
      if (B.type !== 'table') return
      var d = { added: [], changed: {}, deleted: [], isNew: !A }
      if (!A) { out[name] = d; return }
      B.order.forEach(function (k) {
        if (!(k in A.rows)) d.added.push(k)
        else {
          var cells = {}
          B.rows[k].forEach(function (v, i) { if (A.rows[k][i] !== v) cells[i] = A.rows[k][i] })
          if (Object.keys(cells).length) d.changed[k] = cells
        }
      })
      A.order.forEach(function (k) { if (!(k in B.rows)) d.deleted.push(k) })
      if (d.added.length || d.deleted.length || Object.keys(d.changed).length) out[name] = d
    })
    return out
  }

  function headCell(col, m) {
    var cls = []
    if (m && m.pk) cls.push('pk')
    if (m && m.ref) cls.push('fk')
    return el('th', { class: cls.join(' ') }, [
      el('span', { class: 'pg-colname', text: col }),
      m && m.ref ? el('span', { class: 'pg-ref', text: '→ ' + m.ref }) : null
    ])
  }

  function renderTable(cols, rows, metaInfo, d, before, onlyChanged) {
    var thead = el('thead', null, [el('tr', null, cols.map(function (c) { return headCell(c, metaInfo && metaInfo[c]) }))])
    var tbody = el('tbody')
    rows.order.forEach(function (k) {
      var isAdd = d && d.added.indexOf(k) >= 0
      var chg = d && d.changed[k]
      if (onlyChanged && !isAdd && !chg) return
      var tr = el('tr', { class: isAdd ? 'added' : '' })
      rows.rows[k].forEach(function (v, i) {
        if (chg && i in chg) {
          tr.appendChild(el('td', { class: 'chg' }, [el('s', { text: fmt(chg[i]) }), '→ ' + fmt(v)]))
        } else {
          tr.appendChild(el('td', { class: v === null ? 'null' : '', text: fmt(v) }))
        }
      })
      tbody.appendChild(tr)
    })
    if (d && before) d.deleted.forEach(function (k) {
      var tr = el('tr', { class: 'deleted' })
      before.rows[k].forEach(function (v) { tr.appendChild(el('td', { text: fmt(v) })) })
      tbody.appendChild(tr)
    })
    return el('div', { class: 'pg-scroll' }, [el('table', null, [thead, tbody])])
  }

  function mount(root, opts) {
    var lang = opts.lang === 'en' ? 'en' : 'kr'
    var t = T[lang]
    if (!document.getElementById('sqlpg-style')) {
      var st = document.createElement('style'); st.id = 'sqlpg-style'; st.textContent = CSS
      document.head.appendChild(st)
    }
    root.classList.add('sqlpg')
    root.innerHTML = ''
    var status = el('p', { class: 'pg-hint', text: t.loading })
    root.appendChild(status)

    var db, SQL, lastDiff = {}, lastBefore = {}, activeTab = 'EMPLOYEE'
    var uid = 'pg' + Math.random().toString(36).slice(2, 8)

    var picker = el('select', { id: uid + '-pick', 'aria-label': t.pick })
    var groups = {}
    QUERIES.forEach(function (q, i) {
      if (!groups[q[0]]) { groups[q[0]] = el('optgroup', { label: SECTIONS[lang][q[0]] }); picker.appendChild(groups[q[0]]) }
      groups[q[0]].appendChild(el('option', { value: String(i), text: lang === 'en' ? q[2] : q[1] }))
    })
    var editor = el('textarea', { id: uid + '-sql', spellcheck: 'false', 'aria-label': 'SQL' })
    var runBtn = el('button', { class: 'pg-run', type: 'button', text: t.run })
    var resetBtn = el('button', { type: 'button', text: t.reset })
    var out = el('div', { class: 'pg-out', 'aria-live': 'polite' })
    var tabs = el('div', { class: 'pg-tabs', role: 'tablist' })
    var panel = el('div', { class: 'pg-tabpanel' })

    function load(i) { editor.value = QUERIES[i][3] }
    picker.addEventListener('change', function () { load(+picker.value) })

    function fresh() {
      if (db) db.close()
      db = new SQL.Database()
      db.exec(SETUP)
      db.exec('PRAGMA foreign_keys = ON')
      lastDiff = {}; lastBefore = {}
    }

    function drawTables() {
      var snap = snapshot(db)
      var names = Object.keys(snap)
      if (names.indexOf(activeTab) < 0) activeTab = names[0]
      tabs.innerHTML = ''
      names.forEach(function (n) {
        var b = el('button', { class: 'pg-tab', type: 'button', role: 'tab', 'aria-selected': String(n === activeTab) }, [
          n + (snap[n].type === 'view' ? ' (' + t.view + ')' : ''),
          lastDiff[n] ? el('span', { class: 'pg-dot', 'aria-label': 'changed' }) : null
        ])
        b.addEventListener('click', function () { activeTab = n; drawTables() })
        tabs.appendChild(b)
      })
      panel.innerHTML = ''
      var s = snap[activeTab]
      if (!s) return
      if (s.type === 'view') panel.appendChild(el('p', { class: 'pg-hint', text: t.viewNote }))
      panel.appendChild(renderTable(s.cols, s, s.type === 'table' ? meta(db, activeTab) : null, lastDiff[activeTab], lastBefore[activeTab]))
    }

    function summary(d) {
      var parts = []
      if (d.added.length) parts.push(t.added + ' ' + t.rows(d.added.length))
      if (Object.keys(d.changed).length) parts.push(t.updated + ' ' + t.rows(Object.keys(d.changed).length))
      if (d.deleted.length) parts.push(t.deleted + ' ' + t.rows(d.deleted.length))
      return parts.join(', ')
    }

    function run() {
      out.innerHTML = ''
      var sql = editor.value
      if (!sql.trim()) { out.appendChild(el('p', { class: 'pg-hint', text: t.empty })); return }
      var startSnap = snapshot(db)
      var it
      try { it = db.iterateStatements(sql) } catch (e) { out.appendChild(el('div', { class: 'pg-err', text: explain(e.message, t) })); return }
      var firstChanged = null
      while (true) {
        var stmt = null, text = '', before = snapshot(db), names0 = masterNames(db), box = el('div', { class: 'pg-stmt' })
        try {
          var nx = it.next()
          if (nx.done) break
          stmt = nx.value
        } catch (e) {
          box.appendChild(el('div', { class: 'pg-err' }, [explain(e.message, t), el('span', { class: 'pg-raw', text: e.message })]))
          box.appendChild(el('div', { class: 'pg-hint', text: t.stopped }))
          out.appendChild(box)
          break
        }
        text = stmt.getSQL().replace(/^(\s*--[^\n]*\n)+/, '').trim()
        box.appendChild(el('code', { text: text }))
        try {
          var cols = stmt.getColumnNames()
          if (cols.length) {
            var rows = { order: [], rows: {} }, n = 0
            while (stmt.step()) { rows.order.push(n); rows.rows[n] = stmt.get(); n++ }
            box.appendChild(el('div', { class: 'pg-msg', text: n ? t.rows(n) : t.noRows }))
            box.appendChild(renderTable(cols, rows, null, null, null))
          } else {
            stmt.step()
            var after = snapshot(db)
            var d = diff(before, after)
            var names = Object.keys(d)
            if (!names.length) {
              var created = masterNames(db).filter(function (k) { return names0.indexOf(k) < 0 })
              box.appendChild(el('div', { class: 'pg-msg', text: created.length ? t.created(created.join(', ')) : t.nochange }))
            }
            names.forEach(function (nm) {
              if (d[nm].isNew) { box.appendChild(el('div', { class: 'pg-msg', text: t.created(nm) })); return }
              if (!firstChanged) firstChanged = nm
              box.appendChild(el('div', { class: 'pg-msg', text: nm + ': ' + summary(d[nm]) }))
              box.appendChild(renderTable(after[nm].cols, after[nm], meta(db, nm), d[nm], before[nm], true))
            })
          }
          stmt.free()
          out.appendChild(box)
        } catch (e) {
          try { stmt.free() } catch (x) {}
          box.appendChild(el('div', { class: 'pg-err' }, [explain(e.message, t, text), el('span', { class: 'pg-raw', text: e.message })]))
          box.appendChild(el('div', { class: 'pg-hint', text: t.stopped }))
          out.appendChild(box)
          break
        }
      }
      lastBefore = startSnap
      lastDiff = diff(startSnap, snapshot(db))
      var netChanged = objects(db).map(function (o) { return o.name }).filter(function (n) { return lastDiff[n] })
      if (netChanged.length) activeTab = netChanged[0]
      else if (firstChanged) activeTab = firstChanged
      drawTables()
    }

    runBtn.addEventListener('click', run)
    resetBtn.addEventListener('click', function () { fresh(); out.innerHTML = ''; drawTables() })
    editor.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run() }
    })

    opts.initSqlJs({ locateFile: opts.locateFile }).then(function (S) {
      SQL = S
      fresh()
      root.innerHTML = ''
      root.appendChild(el('div', { class: 'pg-bar' }, [picker, runBtn, resetBtn]))
      root.appendChild(editor)
      root.appendChild(el('p', { class: 'pg-hint', text: t.hint }))
      root.appendChild(el('h4', { text: t.result }))
      root.appendChild(out)
      root.appendChild(el('h4', { text: t.tables }))
      root.appendChild(el('p', { class: 'pg-hint', text: t.tablesHint }))
      root.appendChild(tabs)
      root.appendChild(panel)
      var start = QUERIES.findIndex(function (q) { return q[1].indexOf('Research 부서 직원') === 0 })
      picker.value = String(start); load(start)
      drawTables()
    }).catch(function () { status.textContent = t.loadFail })
  }

  global.SqlPlayground = { mount: mount, QUERIES: QUERIES, SETUP: SETUP }
})(typeof window !== 'undefined' ? window : globalThis)
