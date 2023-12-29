module.exports = class Init1703863057152 {
  async up(queryRunner) {
    await queryRunner.query(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        alter table migrations
            owner to assetsproxy;
        
        CREATE TABLE uploadAssets (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        
        alter table uploadAssets
            owner to assetsproxy;
        `);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryRunner) {}
};
