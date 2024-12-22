import { runSeeders } from 'typeorm-extension';
import { AppDataSource } from './data-source';

const runSeeding = async () => {
  try {
    await AppDataSource.initialize();
    await runSeeders(AppDataSource);
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await AppDataSource.destroy();
  }
};

runSeeding();
