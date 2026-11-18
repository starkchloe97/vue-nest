import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Op, fn, col } from 'sequelize';
import { z } from 'zod';
import { Lead, LEAD_STATUSES } from './lead.model.js';

const createLeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(190),
  phone: z.string().trim().min(6).max(40),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  message: z.string().trim().min(5).max(5000),
});

export class LeadsService {
  async create(payload) {
    const parsed = createLeadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new BadRequestException({
        message: 'Please check the submitted lead details.',
        errors: parsed.error.flatten().fieldErrors,
      });
    }
    return Lead.create({
      ...parsed.data,
      email: parsed.data.email.toLowerCase(),
      company: parsed.data.company || null,
      status: 'new',
    });
  }

  async getStats() {
    const [total, grouped] = await Promise.all([
      Lead.count(),
      Lead.findAll({
        attributes: ['status', [fn('COUNT', col('id')), 'count']],
        group: ['status'],
        raw: true,
      }),
    ]);
    const byStatus = Object.fromEntries(LEAD_STATUSES.map((status) => [status, 0]));
    for (const item of grouped) byStatus[item.status] = Number(item.count);
    return { total, byStatus };
  }

  async findAll(query) {
    const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 20));
    const where = {};
    if (LEAD_STATUSES.includes(query.status)) where.status = query.status;
    if (query.search?.trim()) {
      const term = query.search.trim().slice(0, 100);
      where[Op.or] = [
        { name: { [Op.like]: `%${term}%` } },
        { email: { [Op.like]: `%${term}%` } },
        { phone: { [Op.like]: `%${term}%` } },
        { company: { [Op.like]: `%${term}%` } },
      ];
    }
    const result = await Lead.findAndCountAll({
      where,
      attributes: ['id', 'name', 'email', 'phone', 'company', 'status', 'createdAt'],
      order: [['createdAt', 'DESC'], ['id', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });
    return {
      data: result.rows,
      pagination: { page, limit, total: result.count, lastPage: Math.max(1, Math.ceil(result.count / limit)) },
    };
  }

  async findOne(id) {
    if (!/^\d+$/.test(String(id))) throw new NotFoundException('Lead not found.');
    const lead = await Lead.findByPk(id);
    if (!lead) throw new NotFoundException('Lead not found.');
    return lead;
  }

  async updateStatus(id, status) {
    if (!LEAD_STATUSES.includes(status)) throw new BadRequestException('Invalid lead status.');
    const lead = await this.findOne(id);
    await lead.update({ status });
    return lead;
  }
}
