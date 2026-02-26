import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { existsSync } from 'fs';
import { exec } from 'node:child_process';

interface DbBackupOptions {
  autoBackup: boolean;
  removeOldBackup: boolean;
  keepLastDaysBackup: number;
  autoBackupPath: string;
  backupDir: string;
}

@Injectable()
export class BackupService {
  dbOptions: DbBackupOptions = {
    autoBackup: true,
    removeOldBackup: true,
    keepLastDaysBackup: 3,
    autoBackupPath: '.',
    backupDir: 'mongo-backups',
  };
  private logger = new Logger(BackupService.name);

  // Converts string to date
  stringToDate(date: string): Date {
    return new Date(date);
  }

  // Converts date to string
  dateToString(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  AutoBackupDatabase() {
    const currentDate = new Date(); //current date
    const beforeDate: Date = new Date(currentDate.valueOf());
    beforeDate.setDate(
      currentDate.getDate() - this.dbOptions.keepLastDaysBackup
    );

    let oldBackupPath: string;
    let oldBackupDir: string;

    const newBackupDir = this.dateToString(currentDate);
    oldBackupDir = this.dateToString(beforeDate);
    const newBackupPath = `${this.dbOptions.autoBackupPath}/${this.dbOptions.backupDir}/${newBackupDir}`;
    oldBackupDir = `${this.dbOptions.autoBackupPath}/${this.dbOptions.backupDir}/${oldBackupDir}`;

    const cmd = `mongodump --uri ${process.env.DATABASE_PATH} -d ${process.env.DATABASE_NAME}  -o ${newBackupPath}`;
    this.logger.log('Database Backup started... ');

    exec(cmd, (error, stdout, stderr) => {
      // If there is no error then backup is successful
      if (!error) {
        // check for remove old backup after keeping # of days given in configuration.
        if (this.dbOptions.removeOldBackup) {
          if (existsSync(oldBackupPath)) {
            this.logger.log('Removing Old Backups...❎');
            exec(`rm -rf ${newBackupPath}`, (err, stdout, stderr) => {
              if (!err) {
                this.logger.log('Removed Old Backups ✅');
              } else {
                this.logger.log({ err });
              }
            });
          }
        }
      } else {
        this.logger.error(error, stdout, stderr);
      }
    });
  }
}
