-- DropForeignKey
ALTER TABLE "DailyOverride" DROP CONSTRAINT "DailyOverride_appointmentId_fkey";

-- AddForeignKey
ALTER TABLE "DailyOverride" ADD CONSTRAINT "DailyOverride_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
