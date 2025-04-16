import { Column, DataSource, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPackagesEntity } from "./user_packages.entity";
import { AreasEntity, NotificationsEntity, RatesEntity, UserEntity } from "src/entities";
import { EventEmitter2 } from '@nestjs/event-emitter';
@Injectable()
export class UserPackagesService {

    constructor(
        @InjectRepository(UserPackagesEntity)
        private i_repository: Repository<UserPackagesEntity>,
        private dataSource: DataSource,
        private eventEmitter: EventEmitter2,

    ) { }

    async getAll(page: number, limit: number){

      var start_from = (page-1) * limit;

      const query = this.i_repository.createQueryBuilder('user_packages');

      // query.leftJoinAndMapOne('user_packages.ut_id',user_packagesTypesEntity,'user_packages_type','user_packages.ut_id = user_packages_type.id')

      const results = await query
      .orderBy('user_packages.datetime_added', 'DESC')
      .skip(start_from)
      .take(limit) 
      .getManyAndCount();

      return results;
  }

  async getCount() {
    let data = this.dataSource.manager.create(NotificationsEntity, {
      sender_id: 1,
      user_id: 1,
      hasRead: 0,
      description: 'Your account has been approved.',
      datetime_added: new Date()
    });
    let savedNotif = await this.dataSource.manager.save(data);

    const total_cnt = await this.i_repository
      .createQueryBuilder('user_packages')
      .select('COUNT(user_packages.id)', 'cnt')
      .getRawOne();

    this.eventEmitter.emit('on_create_notif', { userID: 1, notif: savedNotif });
    return {
      total_cnt: total_cnt.cnt,
    };
  }

  async findItem(id : number){

      return await this.i_repository.createQueryBuilder("user_packages")
      .where("user_packages.id = :id", {id : id})
      .getOne();
  }

  async checkPackage(user_id : number){

    return await this.i_repository.createQueryBuilder("user_packages")
    .leftJoinAndMapOne('user_packages.user_id',UserEntity,'user','user_packages.user_id = user.id')
    .leftJoinAndMapOne('user_packages.rate_id',RatesEntity,'rate','user_packages.rate_id = rate.id')
    .leftJoinAndMapOne('user_packages.employee_id',UserEntity,'employee','user_packages.employee_id = employee.id')
    .where("user_packages.user_id = :user_id", {user_id : user_id})
    .andWhere("user_packages.isDone = 0")
    .orderBy("user_packages.datetime_added")
    .limit(1)
    .getOne();
}




  async addItem(data: UserPackagesEntity): Promise<UserPackagesEntity>{
    
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

  async getMax(){

    return await this.i_repository.createQueryBuilder("user_packages")
    .orderBy("user_packages.id","DESC")
    .limit(1)
    .getOne();

}

async updatePackage(data:any){

  return await this.i_repository.update(data.id, { 
    isDone: data.isDone,
    payment: data.payment,
    payment_type : data.payment_type
  });

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

      // try {
      //     const browser = await puppeteer.launch();
      //     const page = await browser.newPage();

      //     const content = await compile('report_file', file_data);

      //     await page.setContent(content);

      //     const buffer = await page.pdf({
      //         path: '../reports/' + file_data.file.file_name,
      //         format: 'Letter',
              
      //         margin: {
      //             top: '0.1in',
      //             bottom: '0in',
      //             left: '0.3in',
      //             right: '0.3in'
      //         },
      //         landscape : true,
      //         printBackground : true
      //     })
          
      //     await browser.close();
      //     return buffer;
      // }
      // catch (e){
      //     console.log('error', e);
      // }
}


async getSales(date_from: string, date_to: string, prepared_by: string) {
  try {
    const res_data = await this.i_repository.createQueryBuilder('up')
            .select([
                "CONCAT(u.lname, ', ', u.fname, ' ', u.mname) AS fullname",
                "CONCAT(c.lname, ', ', c.fname, ' ', c.mname) AS c_name",
                "u.id AS receptionist_id",
                "up.user_id AS c_id",
                "CONCAT(a.description, ' - ', r.description) AS rate_name",
                "up.id AS package_id",
                "r.rate AS rate_rate",
                "us.remarks AS remarks",
                "TIMESTAMPDIFF(MINUTE, r.datetime_added, up.datetime_added) AS total",
                "up.datetime_added AS datetime_added",
                "TRUNCATE(up.payment, 2) AS payment",
                "SUM(TRUNCATE(up.payment, 2)) OVER (PARTITION BY up.datetime_added BETWEEN :date_from AND :date_to) AS grandtotal",
            ])
            .innerJoin('user', 'u', 'up.employee_id = u.id')
            .innerJoin('user', 'c', 'c.id = up.user_id')
            .innerJoin('rates', 'r', 'up.rate_id = r.id')
            .innerJoin('areas', 'a', 'r.area_id = a.id')
            .leftJoin('user_sessions', 'us', 'us.package_id = up.id AND us.user_id = up.user_id AND us.status = 0')
            .where('up.datetime_added BETWEEN :date_from AND :date_to', { date_from, date_to })
            .orderBy('up.datetime_added', 'DESC')
            .getRawMany();

        if (!res_data || res_data.length === 0) {
            throw new Error('No sales data found for the given date range.');
        }

        // Format the sales data
        const formattedResData = res_data.map(row => ({
            ...row,
            payment: `₱${parseFloat(row.payment).toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            })}`
        }));

        // Calculate grand total
        const grandTotal = res_data.reduce((total, row) => total + parseFloat(row.payment), 0);
        const formattedGrandTotal = `₱${grandTotal.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        })}`;

        const details = {
            data: formattedResData || [],
            type: 1,
            file: {
                file_name: `SALES_REPORT_${date_from}_${date_to}.pdf`,
            },
            username: '',
            prepared_by: prepared_by,
            chartData: [],
            grandTotal: formattedGrandTotal
        };

    // const details = {
    //     data: res_data || [],
    //     type: 1,
    //     file: {
    //         file_name: `SALES_REPORT_${date_from}_${date_to}.pdf`,
    //     },
    //     username: '',
    //     prepared_by: prepared_by,
    //     chartData: [] // Add the chart data
    // };

    return await this.generateReport(details);

} catch (error) {
    console.error('Error in retrieving sales data:', error);
    throw new Error(`Failed to retrieve sales data: ${error.message}`);
}
}


async getSalesYearly(year_selected: number, prepared_by: string) {
  try {
    const res_data = await this.i_repository.query(
      `SELECT YEAR(datetime_added) as year, 
              MONTH(datetime_added) as month, 
              SUM(payment) as payment
       FROM user_packages
       WHERE isDone = 1 AND YEAR(datetime_added) = ?
       GROUP BY YEAR(datetime_added), MONTH(datetime_added)
       ORDER BY YEAR(datetime_added) DESC, MONTH(datetime_added) DESC
       LIMIT 12`,
      [year_selected]
    );
    const res_data_chart = await this.i_repository.query(
      `SELECT YEAR(datetime_added) as year, 
              MONTH(datetime_added) as month, 
              SUM(payment) as payment
       FROM user_packages
       WHERE isDone = 1 AND YEAR(datetime_added) = ?
       GROUP BY YEAR(datetime_added), MONTH(datetime_added)
       ORDER BY YEAR(datetime_added) DESC, MONTH(datetime_added) ASC
       LIMIT 12`,
      [year_selected]
    );

    if (!res_data || res_data.length === 0) {
      throw new Error(`No sales data found for the selected year: ${year_selected}`);
    }

    const formattedResData = res_data.map(row => ({
      ...row,
      payment: `₱${parseFloat(row.payment).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    }));

    const grandTotal = res_data.reduce((total, row) => total + parseFloat(row.payment), 0);
    const formattedGrandTotal = `₱${grandTotal.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    const details = {
      data: formattedResData,
      chartData: res_data_chart,
      type: 3,
      file: {
        file_name: `SALES_REPORT_YEARLY_${year_selected}.pdf`,
      },
      username: '',
      grandTotal: formattedGrandTotal,
      year_selected: year_selected,
      prepared_by: prepared_by,
    };

    return await this.generateReport(details);
  } catch (error) {
    console.error('Error occurred in getSalesYearly:', error);

    throw new Error(`Failed to retrieve yearly sales data: ${error.message}`);
  }
}



}
