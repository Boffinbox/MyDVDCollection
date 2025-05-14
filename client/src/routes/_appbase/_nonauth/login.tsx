import { useState } from 'react'
import
  {
    createFileRoute,
    Link as RouterLink,
    useNavigate,
  } from '@tanstack/react-router'
import { PostLogin } from '../../../httpverbs/PostLogin'

import
  {
    Sheet,
    FormControl,
    FormLabel,
    Input,
    Button,
    Typography,
    Link,
  } from '@mui/joy'
import { useQueryClient } from '@tanstack/react-query'
import DevLog from '../../../utilities/DevLog'

export const Route = createFileRoute('/_appbase/_nonauth/login')({
  component: LoginComponent,
})

function LoginComponent()
{
  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const [formData, setFormData] = useState({ email: '', password: '' })

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>)
  {
    setFormData((currentData) =>
    {
      return {
        ...currentData,
        [evt.target.name]: evt.target.value,
      }
    })
  }

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>)
  {
    evt.preventDefault()
    DevLog('Form submitted!')
    DevLog('Email is: ', formData.email)
    DevLog('Password is: ', formData.password)
    try
    {
      let token = await PostLogin(formData.email, formData.password)
      queryClient.setQueryData(['accesstoken'], token)
      setFormData(() =>
      {
        return { email: '', password: '' }
      })
      navigate({ to: '/collections' })
    } catch
    {
      // todo
      DevLog('wrong credentials todo inside login.tsx')
    }
  }

  return (
    <>
      <Sheet
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100dvh',
          py: 2, // padding top & bottom
          px: 2, // padding left & right
        }}
      >
        <Sheet
          sx={{
            width: '100%',
            height: '100%',
            gap: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <div>
            <Typography level="h4" component="h1">
              <b>My DVD Collection</b>
            </Typography>
            <Typography level="body-sm">Sign in to continue.</Typography>
          </div>
          <form action="" onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel id="email">Email</FormLabel>
              <Input
                type="text"
                id="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
              />
            </FormControl>
            <FormControl>
              <FormLabel id="password">Password</FormLabel>
              <Input
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
              />
            </FormControl>
            <Button type="submit" sx={{ mt: 1 }} fullWidth>
              Log in
            </Button>
          </form>
          <Typography
            endDecorator={
              <Link
                disabled
                sx={{ textDecoration: 'line-through' }}
                component={RouterLink}
                to="/home"
              >
                Sign up
              </Link>
            }
            fontSize="sm"
            sx={{ alignSelf: 'center' }}
          >
            Don&apos;t have an account?
          </Typography>
          <Typography level="body-xs">
            Signups are currently closed. 🙁
          </Typography>
        </Sheet>
      </Sheet>
    </>
  )
}
