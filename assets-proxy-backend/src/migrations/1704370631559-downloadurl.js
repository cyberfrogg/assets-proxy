module.exports = class Downloadurl1704370631559 {
  async up(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE video
      ADD COLUMN download_url VARCHAR(512) DEFAULT NULL;
    `);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryRunner) {}
};
