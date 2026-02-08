import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '@/app/page'
import axios from 'axios'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Home Page', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  test('renders the main heading', () => {
    render(<Home />)
    
    const heading = screen.getByText('NL Query System')
    expect(heading).toBeInTheDocument()
  })

  test('renders the input field', () => {
    render(<Home />)
    
    const input = screen.getByPlaceholderText(/How many users ordered in the last month/i)
    expect(input).toBeInTheDocument()
  })

  test('renders the submit button', () => {
    render(<Home />)
    
    const button = screen.getByRole('button', { name: /Get Answer/i })
    expect(button).toBeInTheDocument()
  })

  test('submit button is disabled when input is empty', () => {
    render(<Home />)
    
    const button = screen.getByRole('button', { name: /Get Answer/i })
    expect(button).toBeDisabled()
  })

  test('submit button is enabled when input has text', () => {
    render(<Home />)
    
    const input = screen.getByPlaceholderText(/How many users ordered in the last month/i)
    const button = screen.getByRole('button', { name: /Get Answer/i })
    
    fireEvent.change(input, { target: { value: 'Test question' } })
    
    expect(button).not.toBeDisabled()
  })

  test('renders sample questions', () => {
    render(<Home />)
    
    const sampleQuestion = screen.getByText(/How many users ordered in the last month\?/)
    expect(sampleQuestion).toBeInTheDocument()
  })

  test('clicking sample question populates input field', () => {
    render(<Home />)
    
    const input = screen.getByPlaceholderText(/How many users ordered in the last month/i) as HTMLInputElement
    const sampleQuestionButton = screen.getByText(/💬 How many users ordered in the last month\?/)
    
    fireEvent.click(sampleQuestionButton)
    
    expect(input.value).toBe('How many users ordered in the last month?')
  })

  test('displays loading state when submitting', async () => {
    // Mock axios post to never resolve (simulating loading)
    mockedAxios.post.mockImplementation(() => new Promise(() => {}))
    
    render(<Home />)
    
    const input = screen.getByPlaceholderText(/How many users ordered in the last month/i)
    const button = screen.getByRole('button', { name: /Get Answer/i })
    
    fireEvent.change(input, { target: { value: 'Test question' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('Processing...')).toBeInTheDocument()
    })
  })

  test('displays answer after successful submission', async () => {
    // Mock successful API response
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        success: true,
        question: 'How many users ordered?',
        sql: 'SELECT COUNT(*) FROM orders;',
        data: [{ count: '5' }],
        answer: 'There are 5 users who ordered.',
        rowCount: 1,
        model: 'gemini-flash-preview'
      }
    })
    
    render(<Home />)
    
    const input = screen.getByPlaceholderText(/How many users ordered in the last month/i)
    const button = screen.getByRole('button', { name: /Get Answer/i })
    
    fireEvent.change(input, { target: { value: 'How many users ordered?' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('There are 5 users who ordered.')).toBeInTheDocument()
    })
    
    expect(screen.getByText('SQL Query Generated:')).toBeInTheDocument()
    expect(screen.getByText(/SELECT COUNT/)).toBeInTheDocument()
  })

  test('displays error message on API failure', async () => {
    // Mock API error
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        data: {
          error: 'API Error occurred'
        }
      }
    })
    
    render(<Home />)
    
    const input = screen.getByPlaceholderText(/How many users ordered in the last month/i)
    const button = screen.getByRole('button', { name: /Get Answer/i })
    
    fireEvent.change(input, { target: { value: 'Test question' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument()
      expect(screen.getByText(/API Error occurred/)).toBeInTheDocument()
    })
  })

  test('Test Backend Connection button triggers API call', async () => {
    // Mock health check response
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        status: 'Server is running!'
      }
    })
    
    // Mock window.alert
    window.alert = jest.fn()
    
    render(<Home />)
    
    const testButton = screen.getByText('Test Backend Connection')
    fireEvent.click(testButton)
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/health')
      )
    })
  })
})