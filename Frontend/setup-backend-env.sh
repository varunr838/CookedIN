#!/bin/bash

# Backend Environment Variables Setup Script
# Generated from Vly for Git Sync
# Run this script to set up your Convex backend environment variables

echo 'Setting up Convex backend environment variables...'

# Check if Convex CLI is installed
if ! command -v npx &> /dev/null; then
    echo 'Error: npx is not installed. Please install Node.js and npm first.'
    exit 1
fi

echo "Setting JWKS..."
npx convex env set "JWKS" -- "{\"keys\":[{\"use\":\"sig\",\"kty\":\"RSA\",\"n\":\"slqE5r8G_XXQWQz1nGNTHqHsDtcsIsGqx1SOtJ9EmR5Te3IEDxxahoKmNOFA88owliKYSrnxEHQV5fAJLUlMkBdhebvD9yjmLPijVTnGoS7PMGKaWOhcZyhWx1RDE9c3Gy36La7T39U6j1v_XsUt98cT4hV92atht5JqxB2_qF1RF9BB2COSTPyjv75_f-Em56FhasebitmST5sRtfOScU0nPhheTks0F0hDLis_llipr_stOMIjg0-nmLkqDHpnO1mvySc9Xwyq0AssLtUqqqxUJoQl2t5GXlPwysWiM646JleCGFsfr-mF4IjcwVIZfqGYFGHwiNWUZMLR7eQdbQ\",\"e\":\"AQAB\"}]}"

echo "Setting JWT_PRIVATE_KEY..."
npx convex env set "JWT_PRIVATE_KEY" -- "-----BEGIN PRIVATE KEY----- MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCyWoTmvwb9ddBZ DPWcY1MeoewO1ywiwarHVI60n0SZHlN7cgQPHFqGgqY04UDzyjCWIphKufEQdBXl 8AktSUyQF2F5u8P3KOYs+KNVOcahLs8wYppY6FxnKFbHVEMT1zcbLfotrtPf1TqP W/9exS33xxPiFX3Zq2G3kmrEHb+oXVEX0EHYI5JM/KO/vn9/4SbnoWFqx5uK2ZJP mxG185JxTSc+GF5OSzQXSEMuKz+WWKmv+y04wiODT6eYuSoMemc7Wa/JJz1fDKrQ Cywu1SqqrFQmhCXa3kZeU/DKxaIzrjomV4IYWx+v6YXgiNzBUhl+oZgUYfCI1ZRk wtHt5B1tAgMBAAECgf9JJtdbzP4Q90F9RNN4UUTGS6OGcrqnhseE+imN68U3CDk1 aI5BpF98zBlflwQM+eDzszzDaYB2Pya8KLea23WLpAtW4qx9s0i1KUXUrt3JPmm8 brTfwm4j4We2WdkpShxQCYuTMSG1rL9YDWOwey9fcUe2cxorLR/nKyafSZRSeUR/ I+Ywvh8We0Ki/oIJg8QLsrOZpjulwBOZmlMzQXS7lhGVALvbTMm5gxvQYyfsNtIj fjJmZNVfRgJyAWFJqtEz2+BwDZfgWRDp6P2O2t8+g6rrcL3eQ2pASO1T6j+Me53Z Ztpop2FKlvv8otJS0Ve9bNRqHquiAzK8SS4wsf0CgYEA16LQAldtHk/hJxxIUVbk 7U+MyRJW5mWWYm2wkM3jMcuqt0/KX3IxDz9GsCiYEPhizq47UEXy/cyKWPwO3JBF PpHQ1L/4z281OtarWI2hgtwEern8CQQctTxJNIZ4fMWXOLrd0QFizF30TFicRVxq Pos2gyc14BhLvpiyFOFzxw8CgYEA070mSuMcF8Efg6onzv97fH6Rjd2uERHMZKqf GvyXT5vHfiY02DFaZpzClxpO/RlmohINEGjV5HSubv4nEkGT/RgJ4aCDr+/8JjGC MZLzN2nAcfc9W3oYpdJRAXpTDls9nKXx4lA/i4eraOMPMRfEGPtMb4blJvxIayKo Gvk8s8MCgYEAs6dA2AKQtcVlV1lX4vSbTB+PsuHlppSSgzTR+wKdu5nshEck2vpf Z02XjiJz9weKApnkbs+oT80+oj51/0rvdd60dtvt5pzHY1sAbImrO0QlMz6KfdSA Onqcnvc9oO5aO/hr37rg3lWUuJrGr378QVlotEJRv39ec8/x5jWjaP8CgYEAk3Bb sLvSPQxCaIlcrPwjvb3YluOtKL+vBs30enM23b1IvaPXGk/LdjZkHZm5NO6yE9rj 8/A8OJezOyCIjmLRrORHRTBjYmiGuQWyddiwuX5O/ky+EevEK/t2YsQN/6ozDdhT xVZB2WQATMoHMxUsfITIZcSV3n6/4rJAQoAY78cCgYBsJEGUVshFC2AolQFRrCoN 3koEXacRuaH6vHPVnNlSHXReosWhat0Z1eUNSfQOs8wStpaIPWT1/3w+kBV/SZ9D b84j8yGoxyszG4igoLN6cQbo0IspmSvXZs1xmEw8rBlk6jrHq+vcNzRX4VfG4CKO e786a/sIjSOdoqP6lg10WA"

echo "Setting SITE_URL..."
npx convex env set "SITE_URL" -- "http://localhost:5173"

echo "Setting VLY_APP_NAME..."
npx convex env set "VLY_APP_NAME" -- "Dopamine UI"

echo "✅ All backend environment variables have been set!"
echo "You can now run: pnpm dev:backend"
