import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeSessionsEntity } from "./employee_sessions.entity";
import { UserEntity } from "src/entities";

@Injectable()
export class EmployeeSessionsService {

    constructor(
        @InjectRepository(EmployeeSessionsEntity)
        private i_repository: Repository<EmployeeSessionsEntity>,
        private dataSource: DataSource


    ) { }

    async getAll(page: number, limit: number){

      var start_from = (page-1) * limit;

      const query = this.i_repository.createQueryBuilder('employee_sessions');

      // query.leftJoinAndMapOne('employee_sessions.ut_id',employee_sessionsTypesEntity,'employee_sessions_type','employee_sessions.ut_id = employee_sessions_type.id')

      const results = await query
      .orderBy('employee_sessions.datetime_added', 'DESC')
      .skip(start_from)
      .take(limit) 
      .getManyAndCount();

      return results;
  }

  async getCount(){

    const total_cnt = await this.i_repository.createQueryBuilder("employee_sessions")
    .select("COUNT(employee_sessions.id)", "cnt")
    .getRawOne();

    return {
      total_cnt : total_cnt.cnt,
    };
}

  async findItem(id : number){

      return await this.i_repository.createQueryBuilder("employee_sessions")
      .where("employee_sessions.id = :id", {id : id})
      .getOne();
  }

  async searchName(name : string){

    return await this.i_repository.createQueryBuilder("employee_sessions")
    .where("employee_sessions.lname LIKE :name OR employee_sessions.fname LIKE :name", {name : `%${name}%`})
    .getMany();
}

  async addItem(data: EmployeeSessionsEntity): Promise<EmployeeSessionsEntity>{
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try{

      const res = this.i_repository.save(data);
      await queryRunner.commitTransaction();
      return res;
      
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    
  }

  async generateReport(file_data:any){

    const moment = require('moment');
    const puppeteer = require('puppeteer');
    const fs = require('fs-extra');
    const hbs = require('handlebars');
    const path = require('path');
  
    const compile = async function(templateName, data){
        const filePath = path.join(process.cwd(), '../templates', `${templateName}.hbs`);
        const html = await fs.readFile(filePath, 'utf-8');
  
        hbs.registerHelper('ifCheckTitle', function(v1, options) {
            if(v1 != '') {
                return options.fn(this);
              }
              return options.inverse(this);
          });
  
          hbs.registerHelper('ifCheckType', function(v1,v2,options) {
            if(v1 === v2) {
                return options.fn(this);
              }
              return options.inverse(this);
          });  
  
          hbs.registerHelper('ifCheckApproved', function(v1,v2,options) {
            if(v1 === v2) {
                return options.fn(this);
              }
              return options.inverse(this);
          });  
  
          hbs.registerHelper('ifCheckDisplay', function(v1,options) {
            if(v1 == 1) {
                return options.fn(this);
              }
              return options.inverse(this);
          });  
  
          hbs.registerHelper('convertToMonthName', function(v1) {
  
            if(v1 == 1) return "January";
            if(v1 == 2) return "February";
            if(v1 == 3) return "March";
            if(v1 == 4) return "April";
            if(v1 == 5) return "May";
            if(v1 == 6) return "June";
            if(v1 == 7) return "July";
            if(v1 == 8) return "August";
            if(v1 == 9) return "September";
            if(v1 == 10) return "October";
            if(v1 == 11) return "November";
            if(v1 == 12) return "December";
          }); 
  
          hbs.registerHelper('convertToHour', function(v1) {
            v1 = v1 / 60;
            return parseInt(v1,10)
          });
  
          hbs.registerHelper("formatTime", function(datetime, format) {
    
            var DateFormats = {
                    short: "hh:mm a",
                    long: "hh:mm a"
            };
  
            if (moment) {
              // can use other formats like 'lll' too
              format = DateFormats[format] || format;
              return moment(datetime).format(format);
            }
            else {
              return datetime;
            }
          });
  
          hbs.registerHelper("formatDate", function(datetime, format) {
  
            var DateFormats = {
                    short: "DD MMMM - YYYY",
                    long: "dddd DD.MM.YYYY HH:mm"
            };
  
            if (moment) {
              // can use other formats like 'lll' too
              format = DateFormats[format] || format;
              return moment(datetime).format(format);
            }
            else {
              return datetime;
            }
          });
          
        
          hbs.registerHelper('shouldDisplayChart', function(chartData, options) {
            return (chartData && chartData.length > 0) ? options.fn(this) : options.inverse(this);
          });
      
          return hbs.compile(html)(data);
    }
  
    let labels = [];
    let chartData = [];
    let mL = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
      if (file_data.chartData && Array.isArray(file_data.chartData) && file_data.chartData.length > 0) {
        for (let i = 0; i < file_data.chartData.length; i++) {
          labels.push(mL[file_data.chartData[i].month - 1]);
          chartData.push(file_data.chartData[i].payment);
        }
      }
  
      console.log(chartData);
  
      Object.assign(file_data, {
        labels: JSON.stringify(labels),
        chartData: JSON.stringify(chartData),
        hasChartData: chartData.length > 0
      });
      try {
        const browser = await puppeteer.launch({
          headless: false,
          defaultViewport: null,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
    
        const content = await compile('report_file', file_data);
    
        await page.setContent(content, {
          waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
        });
        await page.addStyleTag({
          content: `
            * {
              transition: none !important;
              animation: none !important;
            }
          `,
        });
        const buffer = await page.pdf({
          path: '../reports/' + file_data.file.file_name,
          format: 'Letter',
          margin: {
            top: '0.1in',
            bottom: '0in',
            left: '0.3in',
            right: '0.3in',
          },
          landscape: true,
          printBackground: true,
        });
        await browser.close();
    
        return buffer;
      } catch (e) {
        console.log('error', e);
      }
  }
  

  
  async getTimeMonitoring(date_from: string, date_to: string, receptionist_id: number, prepared_by: string) {
    try {
      // SQL Query with improved JOIN syntax and added salary calculation
      const query = `
        SELECT 
          CONCAT(u.lname, ', ', u.fname, ' ', u.mname) AS fullname,
          u.id AS user_id,
          (
            SELECT MIN(datetime_added) 
            FROM employee_sessions 
            WHERE status = 1 
            AND user_id = emp.user_id 
            AND DATE(datetime_added) = DATE(emp.datetime_added) 
            LIMIT 1
          ) AS time_in,
          (
            SELECT MAX(datetime_added) 
            FROM employee_sessions 
            WHERE status = 0 
            AND user_id = emp.user_id 
            AND DATE(datetime_added) = DATE(emp.datetime_added) 
            LIMIT 1
          ) AS time_out,
          (
            SELECT TIMESTAMPDIFF(MINUTE, MIN(TIME(datetime_added)), MAX(TIME(datetime_added))) 
            FROM employee_sessions 
            WHERE status = 1 
            AND user_id = emp.user_id 
            AND DATE(datetime_added) = DATE(emp.datetime_added) 
            LIMIT 1
          ) AS total_hrs,
          emp.datetime_added AS datetime_added,
          
          -- New column for salary calculation
          CASE 
            WHEN TIMESTAMPDIFF(MINUTE, MIN(TIME(emp.datetime_added)), MAX(TIME(emp.datetime_added))) > 480 AND TIMESTAMPDIFF(MINUTE, MIN(TIME(emp.datetime_added)), MAX(TIME(emp.datetime_added))) < 540 THEN 350
            WHEN TIMESTAMPDIFF(MINUTE, MIN(TIME(emp.datetime_added)), MAX(TIME(emp.datetime_added))) < 480 THEN 
              (350 / 480) * TIMESTAMPDIFF(MINUTE, MIN(TIME(emp.datetime_added)), MAX(TIME(emp.datetime_added)))
            ELSE 
              350 + ((TIMESTAMPDIFF(MINUTE, MIN(TIME(emp.datetime_added)), MAX(TIME(emp.datetime_added))) - 540) * (350 / 480))
          END AS salary
          
        FROM 
          user u
        JOIN 
          employee_sessions emp ON emp.user_id = u.id
        WHERE 
          emp.user_id = ?
          AND emp.datetime_added BETWEEN ? AND ?
        GROUP BY 
          DATE(emp.datetime_added), emp.user_id
        ORDER BY 
          emp.datetime_added DESC;
      `;
      
      const res_data = await this.i_repository.query(query, [receptionist_id, date_from, date_to]);
  
      if (!res_data || res_data.length === 0) {
        return {
          message: 'No time monitoring data found for the given parameters.',
          data: [],
        };
      }

      const formattedResData = res_data.map(row => ({
        ...row,
        salary: `₱${parseFloat(row.salary).toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        })}`
    }));
  
      // Calculate Grand Total Salary
      const grandTotal = formattedResData.reduce((total, row) => {
      
        // Parse salary value and add to total
        const salary = parseFloat(row.salary.replace('₱', '').replace(',', '')) || 0;
      
        return total + salary; // Sum both payments and salary
      }, 0);
      const formattedGrandTotal = `₱${grandTotal.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    })}`;
  
      const details = {
        data: formattedResData,
        type: 2,
        file: {
          file_name: `TM_${receptionist_id}_${date_from}_${date_to}.pdf`,
        },
        username: res_data[0].fullname,
        prepared_by: prepared_by,
        grandTotal: formattedGrandTotal,
      };

      console.log(details);
  
      return await this.generateReport(details);
  
    } catch (error) {
      console.error('Error occurred in getTimeMonitoring:', error);
      throw new Error(`Failed to retrieve time monitoring data for receptionist ${receptionist_id} from ${date_from} to ${date_to}: ${error.message}`);
    }
}

  
  
  

// async getTimeMonitoringList(selected_date : string, receptionist_id : number){

//   const res_data = await this.i_repository.query((`SELECT CONCAT(u.lname,', ',u.fname,' ',u.mname) as fullname,
//     u.id as user_id,
//     (SELECT MIN(datetime_added) FROM employee_sessions WHERE status = 1 AND user_id = emp.user_id AND DATE(datetime_added) = DATE(emp.datetime_added) LIMIT 1) as time_in,
//     (SELECT MAX(datetime_added) FROM employee_sessions WHERE status = 0 AND user_id = emp.user_id AND DATE(datetime_added) = DATE(emp.datetime_added) LIMIT 1) as time_out,
//     (SELECT TIMESTAMPDIFF(MINUTE,MIN(TIME(datetime_added)),MAX(TIME(datetime_added))) FROM employee_sessions WHERE user_id = emp.user_id AND DATE(datetime_added) = DATE(emp.datetime_added) LIMIT 1) as total_hrs,
//     emp.datetime_added as datetime_added
//     FROM user u, employee_sessions emp
//     WHERE emp.user_id = u.id
//     AND emp.user_id = ?
//     AND MONTH(emp.datetime_added) = MONTH(?)
//     AND YEAR(emp.datetime_added) = YEAR(?)
//     GROUP BY DATE(emp.datetime_added) DESC, emp.user_id`), [receptionist_id,selected_date,selected_date]);

//     return res_data;
// }

  async getTimeMonitoringList(selected_date: string, receptionist_id: number) {
    const query = `
      SELECT 
        CONCAT(u.lname, ', ', u.fname, ' ', u.mname) AS fullname,
        u.id AS user_id,
        DATE(emp.datetime_added) AS date,
        MIN(CASE WHEN emp.status = 1 THEN emp.datetime_added END) AS time_in,
        MAX(CASE WHEN emp.status = 0 THEN emp.datetime_added END) AS time_out,
        TIMESTAMPDIFF(
          MINUTE, 
          MIN(CASE WHEN emp.status = 1 THEN emp.datetime_added END),
          MAX(CASE WHEN emp.status = 0 THEN emp.datetime_added END)
        ) AS total_hrs
      FROM 
        user u
      INNER JOIN 
        employee_sessions emp ON u.id = emp.user_id
      WHERE 
        emp.user_id = ?
        AND DATE(emp.datetime_added) = DATE(?)
      GROUP BY 
        DATE(emp.datetime_added), u.id
      ORDER BY 
        DATE(emp.datetime_added) DESC;
    `;

    const res_data = await this.i_repository.query(query, [receptionist_id, selected_date]);
    return res_data;
  }


}
