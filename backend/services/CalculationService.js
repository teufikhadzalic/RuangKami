/**
 * Service for calculating room booking costs
 */
class CalculationService {
    /**
     * Calculate the duration of booking in hours
     * @param {string} startTime - Format: "HH:MM" (24-hour)
     * @param {string} endTime - Format: "HH:MM" (24-hour)
     * @returns {number} Duration in hours (can be decimal)
     */
    static calculateDuration(startTime, endTime) {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        
        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;
        
        // Calculate difference in minutes
        const durationMinutes = endTotalMinutes - startTotalMinutes;
        
        // Convert to hours (with decimal)
        return durationMinutes / 60;
    }
    
    /**
     * Calculate the base cost for room rental
     * @param {number} baseRatePerHour - Room's base rate per hour
     * @param {number} durationHours - Duration in hours
     * @returns {number} Base cost
     */
    static calculateBaseCost(baseRatePerHour, durationHours) {
        return baseRatePerHour * durationHours;
    }
    
    /**
     * Calculate electricity consumption in kWh
     * @param {Object} room - Room object with facilities information
     * @param {Object} useFacilities - Which facilities are being used
     * @param {number} durationHours - Duration in hours
     * @returns {number} Electricity consumption in kWh
     */
    static calculateElectricityConsumption(room, useFacilities, durationHours) {
        let totalWattage = 0;
        
        // Calculate AC consumption
        if (useFacilities.useAC) {
            const acCount = Math.min(
                useFacilities.numberOfACUsed || 0, 
                room.facilities.numberOfAC || 0
            );
            totalWattage += acCount * (room.facilities.acPowerConsumption || 1500);
        }
        
        // Calculate lights consumption
        if (useFacilities.useLights) {
            const lightsCount = Math.min(
                useFacilities.numberOfLightsUsed || 0,
                room.facilities.numberOfLights || 0
            );
            totalWattage += lightsCount * (room.facilities.lightPowerConsumption || 60);
        }
        
        // Calculate projector consumption (estimated 300W)
        if (useFacilities.useProjector && room.facilities.hasProjector) {
            totalWattage += 300;
        }
        
        // Calculate audio system consumption
        if (useFacilities.useAudioSystem && room.facilities.hasAudioSystem) {
            totalWattage += room.facilities.audioSystemPowerConsumption || 200;
        }
        
        // Calculate computers consumption (estimated 200W per computer)
        if (useFacilities.useComputers) {
            const computerCount = Math.min(
                useFacilities.numberOfComputersUsed || 0,
                room.facilities.numberOfComputers || 0
            );
            totalWattage += computerCount * 200;
        }
        
        // Convert watt-hours to kilowatt-hours
        return (totalWattage * durationHours) / 1000;
    }
    
    /**
     * Calculate electricity cost
     * @param {number} consumptionKWh - Electricity consumption in kWh
     * @param {number} ratePerKWh - Electricity rate per kWh
     * @returns {number} Electricity cost
     */
    static calculateElectricityCost(consumptionKWh, ratePerKWh) {
        return consumptionKWh * ratePerKWh;
    }
    
    /**
     * Calculate total booking cost
     * @param {Object} room - Room object with rate information
     * @param {string} startTime - Format: "HH:MM" (24-hour)
     * @param {string} endTime - Format: "HH:MM" (24-hour)
     * @param {Object} useFacilities - Which facilities are being used
     * @returns {Object} Cost breakdown and total
     */
    static calculateTotalCost(room, startTime, endTime, useFacilities) {
        const durationHours = this.calculateDuration(startTime, endTime);
        const baseCost = this.calculateBaseCost(room.baseRatePerHour, durationHours);
        
        const electricityConsumption = this.calculateElectricityConsumption(
            room, 
            useFacilities, 
            durationHours
        );
        
        const electricityCost = this.calculateElectricityCost(
            electricityConsumption, 
            room.electricityRatePerKWh
        );
        
        const totalCost = baseCost + electricityCost;
        
        return {
            baseRate: parseFloat(baseCost.toFixed(2)),
            electricityCost: parseFloat(electricityCost.toFixed(2)),
            totalCost: parseFloat(totalCost.toFixed(2)),
            details: {
                durationHours: parseFloat(durationHours.toFixed(2)),
                electricityConsumptionKWh: parseFloat(electricityConsumption.toFixed(2))
            }
        };
    }
    
    /**
     * Check if a room is available for booking at the specified time
     * @param {Object} room - Room object
     * @param {Date} date - Booking date
     * @param {string} startTime - Format: "HH:MM" (24-hour)
     * @param {string} endTime - Format: "HH:MM" (24-hour)
     * @param {Array} existingBookings - Array of existing bookings for the room
     * @returns {boolean} True if room is available, false otherwise
     */
    static isRoomAvailable(room, date, startTime, endTime, existingBookings) {
        // Check if room is active
        if (!room.isActive) {
            return false;
        }
        
        // Format date to YYYY-MM-DD for comparison
        const bookingDate = new Date(date).toISOString().split('T')[0];
        
        // Check for maintenance on that day
        const hasMaintenance = room.maintenanceSchedule.some(schedule => {
            const maintenanceDate = new Date(schedule.date).toISOString().split('T')[0];
            return maintenanceDate === bookingDate;
        });
        
        if (hasMaintenance) {
            return false;
        }
        
        // Check for conflicts with existing bookings
        const hasConflict = existingBookings.some(booking => {
            const existingDate = new Date(booking.date).toISOString().split('T')[0];
            
            // Only check bookings on the same day
            if (existingDate !== bookingDate) {
                return false;
            }
            
            // Check if booking status is confirmed or pending
            if (booking.status !== 'confirmed' && booking.status !== 'pending') {
                return false;
            }
            
            // Check for time overlap
            return (
                (startTime >= booking.startTime && startTime < booking.endTime) ||
                (endTime > booking.startTime && endTime <= booking.endTime) ||
                (startTime <= booking.startTime && endTime >= booking.endTime)
            );
        });
        
        return !hasConflict;
    }
}

module.exports = CalculationService;