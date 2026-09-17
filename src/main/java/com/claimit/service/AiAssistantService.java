package com.claimit.service;

import com.claimit.dto.AiQuestionRequest;
import com.claimit.dto.AiResponse;
import com.claimit.model.Scheme;
import com.claimit.model.SchemeDocument;
import com.claimit.repository.SchemeRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AiAssistantService {

    private final SchemeRepository schemeRepository;

    public AiAssistantService(SchemeRepository schemeRepository) {
        this.schemeRepository = schemeRepository;
    }

    public AiResponse answerQuestion(AiQuestionRequest request) {
        String q = request.getQuestion() != null ? request.getQuestion().trim().toLowerCase() : "";
        String lang = request.getLanguage() != null ? request.getLanguage().toLowerCase() : "en";
        boolean isTelugu = "te".equals(lang) || q.contains("telugu") || q.contains("తెలుగు");

        Optional<Scheme> schemeOpt = request.getSchemeId() != null 
                ? schemeRepository.findById(request.getSchemeId()) 
                : Optional.empty();

        List<String> suggestions = new ArrayList<>();
        suggestions.add(isTelugu ? "ఈ పథకానికి ఏ పత్రాలు కావాలి?" : "What documents do I need for this scheme?");
        suggestions.add(isTelugu ? "నేను ఎలా దరఖాస్తు చేసుకోవాలి?" : "How do I apply for this benefit?");
        suggestions.add(isTelugu ? "నా అర్హత ఎలా లెక్కించబడింది?" : "Why am I potentially eligible?");
        suggestions.add(isTelugu ? "ముగింపు గడువు ఎప్పుడు?" : "When is the application deadline?");

        String answer;

        if (q.contains("document") || q.contains("పత్రాల") || q.contains("కావాలి")) {
            if (schemeOpt.isPresent()) {
                Scheme s = schemeOpt.get();
                StringBuilder sb = new StringBuilder();
                if (isTelugu) {
                    sb.append("📋 **").append(s.getTitleTe() != null ? s.getTitleTe() : s.getTitle()).append("** కోసం అవసరమైన పత్రాలు:\n\n");
                } else {
                    sb.append("📋 Required Documents for **").append(s.getTitle()).append("**:\n\n");
                }
                for (SchemeDocument sd : s.getSchemeDocuments()) {
                    sb.append("• ").append(isTelugu && sd.getDocument().getNameTe() != null ? sd.getDocument().getNameTe() : sd.getDocument().getName());
                    if (sd.getNotes() != null) {
                        sb.append(" (").append(sd.getNotes()).append(")");
                    }
                    sb.append("\n");
                }
                sb.append(isTelugu 
                    ? "\n💡 దరఖాస్తు చేసేముందు ఈ పత్రాలను 100KB లోపు PDF లేదా JPG ఫార్మాట్‌లో సిద్ధం చేసుకోండి."
                    : "\n💡 Tip: Ensure all documents are scanned clearly in PDF or JPEG format under 100KB before uploading to the official portal.");
                answer = sb.toString();
            } else {
                answer = isTelugu 
                    ? "సాధారణంగా ప్రభుత్వ పథకాలకు ఆధార్ కార్డు, ఆదాయ ధృవీకరణ పత్రం, నివాస ధృవీకరణ పత్రం, బ్యాంక్ పాస్‌బుక్ మరియు విద్యా సర్టిఫికెట్లు అవసరం."
                    : "Common documents required across government schemes include: 1) Aadhaar Card, 2) Income Certificate, 3) Bank Passbook (Aadhaar linked), 4) Study/Bonafide Certificate, 5) Domicile/Residence Certificate.";
            }
        } else if (q.contains("why") || q.contains("eligible") || q.contains("qualify") || q.contains("అర్హత")) {
            if (schemeOpt.isPresent()) {
                Scheme s = schemeOpt.get();
                answer = isTelugu
                    ? "🎯 **మీరు ఎందుకు అర్హత సాధించవచ్చంటే:** మీ వయస్సు, నివాస రాష్ట్రం, విద్యా స్థాయి మరియు కుటుంబ వార్షిక ఆదాయం (" + s.getBenefitDisplay() + ") నిబంధనలకు అనుకూలంగా ఉన్నాయి. అధికారిక వెరిఫికేషన్ కోసం మీ సంబంధిత పత్రాలను పోర్టల్‌లో సమర్పించాల్సి ఉంటుంది."
                    : "🎯 **Why You May Qualify:** Based on your submitted profile (Occupation, State, Income, and Education), your credentials align with the eligibility criteria for **" + s.getTitle() + "**. This scheme offers " + s.getBenefitDisplay() + ".";
            } else {
                answer = isTelugu
                    ? "క్లెయిమ్‌ఇట్ మీ ప్రొఫైల్ ఆధారంగా వయస్సు, రాష్ట్రం, విద్య, కులం మరియు కుటుంబ వార్షిక ఆదాయాన్ని నిబంధనలతో పోల్చి అర్హత శాతాన్ని గణిస్తుంది."
                    : "ClaimIt evaluates your profile across 6 key parameters: Occupation, Annual Income threshold, State domicile, Education level, Age bracket, and Academic merit/Category.";
            }
        } else if (q.contains("how to apply") || q.contains("steps") || q.contains("process") || q.contains("దరఖాస్తు")) {
            if (schemeOpt.isPresent()) {
                Scheme s = schemeOpt.get();
                answer = (isTelugu ? "🚀 **దరఖాస్తు విధానం:**\n1. అధికారిక వెబ్‌సైట్ (" : "🚀 **Step-by-Step Application Process:**\n1. Visit the official portal (")
                        + s.getOfficialPortalUrl() + ")\n"
                        + (isTelugu ? "2. కొత్త రిజిస్ట్రేషన్ చేసుకోండి\n3. వ్యక్తిగత & విద్యా వివరాలు నమోదు చేయండి\n4. అవసరమైన సర్టిఫికెట్లు అప్‌లోడ్ చేయండి\n5. ఫారమ్ సబ్మిట్ చేసి రశీదు నంబర్ భద్రపరుచుకోండి."
                                   : "2. Register with Aadhaar / Mobile number\n3. Fill in candidate and academic information\n4. Upload scanned document proofs\n5. Submit online application and note down your Reference/Acknowledgment number.");
            } else {
                answer = isTelugu 
                    ? "ప్రతి పథకం వివరాల పేజీలో దశలవారీ దరఖాస్తు విధానం మరియు అధికారిక పోర్టల్ లింక్ అందించబడింది."
                    : "Click on any scheme card to see the step-by-step application timeline and direct official portal link.";
            }
        } else if (isTelugu || q.contains("తెలుగు") || q.contains("telugu")) {
            answer = "నమస్కారం! నేను క్లెయిమ్‌ఇట్ (నా హక్కు) సహాయకుడిని. మీకు సరిపోయే స్కాలర్‌షిప్‌లు, సబ్సిడీలు, అవసరమైన పత్రాలు మరియు దరఖాస్తు విధానం గురించి నన్ను ఏ ప్రశ్నైనా అడగవచ్చు.";
        } else {
            answer = "Hello! I am your ClaimIt (నా హక్కు) discovery assistant. You can ask me about available scholarships, welfare schemes, document checklists, why you qualify, or how to apply step-by-step.";
        }

        return new AiResponse(answer, lang, suggestions, true);
    }
}
