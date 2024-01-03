module.exports = class Queue1704301952859 {
  async up(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE uploadAssets
      ADD COLUMN task_status VARCHAR(32) NOT NULL,
      ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN url VARCHAR(1024) NOT NULL,
      ADD COLUMN die_at TIMESTAMP NOT NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE uploadAssets RENAME TO video;
    `);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryRunner) {}
};
