import { Request, Response } from 'express';
import {
  CreateQuotationUseCase,
  GetQuotationListUseCase,
  GetQuotationDetailUseCase,
  UpdateQuotationUseCase,
  GenerateQuotationShareLinkUseCase,
  GenerateQuotationPdfUseCase,
} from '../../usecases';
import {
  CreateQuotationRequestDto,
  UpdateQuotationRequestDto,
} from '../../usecases/dto';
import { QuotationRepository } from '../../infrastructure/repositories';

export class QuotationController {
  private createQuotationUseCase: CreateQuotationUseCase;
  private getQuotationListUseCase: GetQuotationListUseCase;
  private getQuotationDetailUseCase: GetQuotationDetailUseCase;
  private updateQuotationUseCase: UpdateQuotationUseCase;
  private generateQuotationShareLinkUseCase: GenerateQuotationShareLinkUseCase;
  private generateQuotationPdfUseCase: GenerateQuotationPdfUseCase;

  constructor() {
    const quotationRepository = new QuotationRepository();
    this.createQuotationUseCase = new CreateQuotationUseCase(quotationRepository);
    this.getQuotationListUseCase = new GetQuotationListUseCase(quotationRepository);
    this.getQuotationDetailUseCase = new GetQuotationDetailUseCase(quotationRepository);
    this.updateQuotationUseCase = new UpdateQuotationUseCase(quotationRepository);
    this.generateQuotationShareLinkUseCase = new GenerateQuotationShareLinkUseCase(quotationRepository);
    this.generateQuotationPdfUseCase = new GenerateQuotationPdfUseCase(quotationRepository);
  }

  createQuotation = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          status: false,
          message: 'unauthorized',
          results: [],
          errors: ['User not authenticated'],
        });
        return;
      }

      const payload: CreateQuotationRequestDto = req.body;
      const result = await this.createQuotationUseCase.execute({
        userId: req.user.userId,
        payload,
      });

      res.status(201).json({
        status: true,
        message: 'success',
        results: [result],
        errors: [],
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create quotation';
      res.status(400).json({
        status: false,
        message: 'creation_failed',
        results: [],
        errors: [message],
      });
    }
  };

  getQuotations = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          status: false,
          message: 'unauthorized',
          results: [],
          errors: ['User not authenticated'],
        });
        return;
      }

      const results = await this.getQuotationListUseCase.execute({
        userId: req.user.userId,
      });

      res.status(200).json({
        status: true,
        message: 'success',
        results,
        errors: [],
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch quotations';
      res.status(400).json({
        status: false,
        message: 'fetch_failed',
        results: [],
        errors: [message],
      });
    }
  };

  getQuotationById = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          status: false,
          message: 'unauthorized',
          results: [],
          errors: ['User not authenticated'],
        });
        return;
      }

      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          status: false,
          message: 'invalid_request',
          results: [],
          errors: ['Quotation ID is required'],
        });
        return;
      }
      const result = await this.getQuotationDetailUseCase.execute({
        quotationId: id,
        userId: req.user.userId,
      });

      res.status(200).json({
        status: true,
        message: 'success',
        results: [result],
        errors: [],
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch quotation';
      const statusCode = message === 'Quotation not found' ? 404 : message === 'Access denied' ? 403 : 400;
      res.status(statusCode).json({
        status: false,
        message: 'fetch_failed',
        results: [],
        errors: [message],
      });
    }
  };

  updateQuotation = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          status: false,
          message: 'unauthorized',
          results: [],
          errors: ['User not authenticated'],
        });
        return;
      }

      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          status: false,
          message: 'invalid_request',
          results: [],
          errors: ['Quotation ID is required'],
        });
        return;
      }
      const payload: UpdateQuotationRequestDto = req.body;

      await this.updateQuotationUseCase.execute({
        userId: req.user.userId,
        quotationId: id,
        payload,
      });

      res.status(200).json({
        status: true,
        message: 'updated',
        results: [],
        errors: [],
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update quotation';
      const statusCode = message === 'Quotation not found' ? 404 : message === 'Access denied' ? 403 : 400;
      res.status(statusCode).json({
        status: false,
        message: 'update_failed',
        results: [],
        errors: [message],
      });
    }
  };

  generateShareLink = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          status: false,
          message: 'unauthorized',
          results: [],
          errors: ['User not authenticated'],
        });
        return;
      }

      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          status: false,
          message: 'invalid_request',
          results: [],
          errors: ['Quotation ID is required'],
        });
        return;
      }
      const result = await this.generateQuotationShareLinkUseCase.execute({
        quotationId: id,
        userId: req.user.userId,
      });

      res.status(200).json({
        status: true,
        message: 'success',
        results: [result],
        errors: [],
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate share link';
      const statusCode = message === 'Quotation not found' ? 404 : message === 'Access denied' ? 403 : 400;
      res.status(statusCode).json({
        status: false,
        message: 'share_failed',
        results: [],
        errors: [message],
      });
    }
  };

  downloadQuotationPdf = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          status: false,
          message: 'unauthorized',
          results: [],
          errors: ['User not authenticated'],
        });
        return;
      }

      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          status: false,
          message: 'invalid_request',
          results: [],
          errors: ['Quotation ID is required'],
        });
        return;
      }
      const { buffer, fileName } = await this.generateQuotationPdfUseCase.execute({
        quotationId: id,
        userId: req.user.userId,
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(buffer);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to download PDF';
      const statusCode = message === 'Quotation not found' ? 404 : message === 'Access denied' ? 403 : 400;
      res.status(statusCode).json({
        status: false,
        message: 'pdf_failed',
        results: [],
        errors: [message],
      });
    }
  };
}
